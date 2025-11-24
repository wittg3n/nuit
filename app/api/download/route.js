import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import ytdl from "ytdl-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestHeaders = {
  // Helps avoid 403/410 responses from YouTube by mimicking a real browser request.
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.youtube.com/",
  Origin: "https://www.youtube.com",
};

const requestOptions = {
  requestOptions: {
    headers: requestHeaders,
  },
};

function sanitizeFilename(title = "video") {
  const safeTitle = title.replace(/[<>:"/\\|?*]+/g, "").trim();
  return safeTitle || "video";
}

function normalizeYouTubeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    const hostname = parsed.hostname.replace(/^www\./, "");

    // Strip tracking parameters that sometimes lead to 410 responses.
    parsed.searchParams.delete("si");

    // Accept common YouTube hosts and rebuild a canonical watch URL.
    if (["youtube.com", "youtu.be", "m.youtube.com"].includes(hostname)) {
      let videoId = parsed.searchParams.get("v");

      if (!videoId && parsed.pathname?.length > 1 && hostname === "youtu.be") {
        // youtu.be/<id>
        videoId = parsed.pathname.slice(1);
      }

      if (videoId) {
        const canonical = new URL("https://www.youtube.com/watch");
        canonical.searchParams.set("v", videoId);

        // Preserve timestamp if present.
        if (parsed.searchParams.has("t")) {
          canonical.searchParams.set("t", parsed.searchParams.get("t"));
        }

        return canonical.toString();
      }
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

function createErrorResponse(error) {
  const statusCode = error?.statusCode;

  if (statusCode === 410) {
    return NextResponse.json(
      {
        error:
          "YouTube returned a 410 (Gone) response. Copy the full watch URL from your browser and try again.",
      },
      { status: 410 }
    );
  }

  if (statusCode === 403) {
    return NextResponse.json(
      { error: "YouTube refused the request. Please try again later." },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { error: "Unable to download this video right now." },
    { status: 500 }
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = normalizeYouTubeUrl(searchParams.get("url"));

  if (!url) {
    return NextResponse.json(
      { error: "Missing url query parameter." },
      { status: 400 }
    );
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json(
      { error: "Please provide a valid YouTube watch URL." },
      { status: 400 }
    );
  }

  try {
    const info = await ytdl.getInfo(url, requestOptions);
    const title = sanitizeFilename(info.videoDetails.title);

    const combinedFormats = ytdl.filterFormats(info.formats, "audioandvideo");
    if (!combinedFormats.length) {
      return NextResponse.json(
        {
          error:
            "No combined audio/video stream is available for this link. Try a different video.",
        },
        { status: 422 }
      );
    }

    const format = ytdl.chooseFormat(combinedFormats, {
      quality: "highest",
    });

    const stream = ytdl.downloadFromInfo(info, {
      format,
      quality: format?.itag ?? "highest",
      requestOptions: requestOptions.requestOptions,
    });

    const webStream = Readable.toWeb(stream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${title}.mp4"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("YouTube download failed", error);
    return createErrorResponse(error);
  }
}
