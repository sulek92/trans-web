'use client'

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pl">
      <body className="antialiased bg-[#f7fafa] min-h-screen flex flex-col items-center justify-center px-6 text-center font-sans">
        <span className="text-7xl mb-8" role="img" aria-label="error">
          &#9888;
        </span>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Wystąpił krytyczny błąd
        </h1>
        <p className="text-lg text-slate-500 max-w-lg mb-8">
          Przepraszamy, wystąpił nieoczekiwany błąd. Prosimy odświeżyć stronę.
        </p>
        <button
          onClick={reset}
          className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all"
        >
          Odśwież stronę
        </button>
        {error.digest && (
          <p className="text-xs text-slate-400 mt-8">
            ID błędu: {error.digest}
          </p>
        )}
      </body>
    </html>
  )
}
