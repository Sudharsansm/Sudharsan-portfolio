import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import usePageMeta from '../hooks/usePageMeta.js'

export default function NotFound() {
  usePageMeta({ title: 'Page not found', noindex: true })

  return (
    <>
      <Header mode="page" />
      <main id="main" className="px-6 pb-32 pt-44 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">404</p>
        <h1 className="mb-4 font-display text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mb-8 max-w-md text-zinc-500 dark:text-zinc-400">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="nl text-sm font-medium text-accent">
          Back to home →
        </Link>
      </main>
      <Footer />
    </>
  )
}
