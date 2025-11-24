import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import ytdl from "ytdl-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeFilename(title = "video") {
  const safeTitle = title.replace(/[<>:"/\\|?*]+/g, "").trim();
  return safeTitle || "video";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url query parameter." },
      { status: 400 }
    );
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json(
      { error: "Please provide a valid YouTube URL." },
      { status: 400 }
    );
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = sanitizeFilename(info.videoDetails.title);
    const format = ytdl.chooseFormat(info.formats, {
      filter: "audioandvideo",
      quality: "highest",
    });

    const stream = ytdl(url, {
      quality: format?.itag ?? "highest",
      filter: "audioandvideo",
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
    return NextResponse.json(
      { error: "Unable to download this video right now." },
      { status: 500 }
    );
  }
}
