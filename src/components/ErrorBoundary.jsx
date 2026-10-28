import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error(error, info)
    // Hook up an error-reporting service (Sentry, etc.) here if you add one.
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">Something went wrong</p>
        <h1 className="mb-4 font-display text-3xl font-bold text-zinc-900 dark:text-white">
          This page failed to load.
        </h1>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">Please refresh, or head back to the home page.</p>
        <a href="/" className="nl text-sm font-medium text-accent">
          Back to home →
        </a>
      </main>
    )
  }
}
