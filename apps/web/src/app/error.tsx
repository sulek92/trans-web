'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.error('Page error:', error.message)
    }
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="material-symbols-outlined text-7xl text-[var(--color-primary)] mb-8">
        error_outline
      </span>
      <h1 className="text-4xl font-display font-bold text-[var(--color-on-background)] mb-4">
        Wystąpił błąd
      </h1>
      <p className="text-lg text-[var(--color-on-surface-variant)] max-w-lg mb-8">
        Przepraszamy, coś poszło nie tak. Spróbuj ponownie za chwilę.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/"
          className="border border-[var(--color-outline-variant)] px-8 py-4 rounded-2xl font-bold hover:bg-[var(--color-surface-container-low)] transition-all"
        >
          Strona główna
        </Link>
      </div>
    </div>
  )
}
