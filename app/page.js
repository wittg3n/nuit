const features = [
  {
    title: "One-click downloads",
    description:
      "Paste any YouTube link and instantly grab the full video without extra steps.",
  },
  {
    title: "Optimized quality",
    description:
      "We pick the best available combined audio and video so your saved file looks and sounds great.",
  },
  {
    title: "Private by default",
    description: "Requests stay server-side—no history or tracking stored in your browser.",
  },
];

const steps = [
  "Paste the full YouTube URL into the field below.",
  "Press Download Video to start the transfer.",
  "Your browser will prompt you to save the MP4 file.",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-amber-50 text-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
        <header className="space-y-4 text-center sm:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-amber-200/50">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" aria-hidden />
            Nuit YouTube Downloader
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Download YouTube videos without ads, limits, or waiting.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-600">
            Keep the videos you love for offline viewing. Paste a link, hit download, and
            get a clean MP4 straight from YouTube.
          </p>
        </header>

        <main className="grid gap-10 lg:grid-cols-[2fr,1fr] lg:items-start">
          <section className="space-y-6 rounded-2xl border border-amber-100 bg-white p-8 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.25)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Download a video</h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  MP4 output
                </span>
              </div>
              <p className="text-sm text-zinc-600">
                We fetch the best available quality with audio and video combined.
              </p>
            </div>

            <form
              className="space-y-4"
              action="/api/download"
              method="GET"
              target="_blank"
            >
              <label className="space-y-2 text-sm font-medium text-zinc-800">
                <span className="block">YouTube URL</span>
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=example"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 shadow-inner shadow-amber-50 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-200"
                />
              </label>

              <p className="text-xs text-zinc-500">
                Tip: copy the full watch URL from your browser instead of a shortened share
                link to avoid YouTube 410 errors.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
                  Best available quality
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden />
                  Audio + video
                </span>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-base font-semibold text-white shadow-lg shadow-amber-200/50 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-200/60 focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                Download video
                <span aria-hidden className="text-lg">
                  ↓
                </span>
              </button>
              <p className="text-xs text-zinc-500">
                Your download starts in a new tab. Keep this page open if you want to grab
                more videos.
              </p>
            </form>

            <div className="space-y-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <div className="font-semibold text-amber-800">How it works</div>
              <ul className="space-y-2 list-disc list-inside">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="space-y-4 rounded-2xl border border-zinc-100 bg-white/80 p-8 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.25)] backdrop-blur">
            <h2 className="text-lg font-semibold">Why choose Nuit?</h2>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="space-y-2 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
                    {feature.title}
                  </div>
                  <p className="text-sm leading-6 text-zinc-600">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Tip: Save time by queuing multiple downloads in separate tabs.
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
