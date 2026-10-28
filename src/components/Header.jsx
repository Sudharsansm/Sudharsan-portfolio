import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useDarkMode from '../hooks/useDarkMode'
import useScrolled from '../hooks/useScrolled'
import useSectionSpy from '../hooks/useSectionSpy'
import { SunIcon, MoonIcon, MenuIcon, CloseIcon, ArrowRightIcon } from './Icons'

const HOME_SECTIONS = ['hero', 'services', 'work', 'about', 'skills', 'blog', 'contact']
const NO_SECTIONS = []

// mode="home"   -> in-page hash links + scroll-spy highlighting (used on "/")
// mode="page"   -> links back to "/" sections + highlights `current` route
export default function Header({ mode = 'page', current = '' }) {
  const [dark, setDark] = useDarkMode()
  const scrolled = useScrolled(20)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useSectionSpy(mode === 'home' ? HOME_SECTIONS : NO_SECTIONS)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const navLinkClass = (key) => {
    const isOn = mode === 'home' ? activeSection === key : current === key
    return `nl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ${
      isOn ? 'on !text-zinc-900 dark:!text-white' : ''
    }`
  }

  const subNavLinkClass = (key) =>
    `nl transition-colors ${
      current === key
        ? 'text-accent font-medium'
        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
    }`

  // Desktop nav items: {key, label, href}
  const items = [
    { key: 'services', label: 'Services', href: mode === 'home' ? '#services' : '/#services' },
    { key: 'work', label: 'Work', href: mode === 'home' ? '#work' : '/projects' },
    { key: 'about', label: 'About', href: mode === 'home' ? '#about' : '/#about' },
    { key: 'skills', label: 'Skills', href: mode === 'home' ? '#skills' : null },
    { key: 'blog', label: 'Blog', href: mode === 'home' ? '#blog' : '/blog' },
    { key: 'contact', label: 'Contact', href: mode === 'home' ? '#contact' : '/#contact' },
  ].filter((i) => i.href)

  const renderLink = (href, className, label, onClick) => {
    // In-app routes (including "/#section") go through the router; bare "#section" stays a plain anchor.
    if (href.startsWith('/')) {
      return (
        <Link to={href} className={className} onClick={onClick}>
          {label}
        </Link>
      )
    }
    return (
      <a href={href} className={className} onClick={onClick}>
        {label}
      </a>
    )
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <div
        className={`absolute inset-0 -z-10 transition-opacity duration-300 ${
          scrolled
            ? 'bg-white/90 opacity-100 shadow-sm shadow-black/5 backdrop-blur-md dark:bg-zinc-950/90'
            : 'opacity-0'
        }`}
      />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Main navigation">
        <Link to="/" className="relative z-10 font-display text-xl font-bold tracking-tight">
          <span className="text-accent">sud</span>
          <span className="text-zinc-900 dark:text-white">har</span>
          <span className="text-accent">san</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {items.map((item) => (
            <li key={item.key}>
              {renderLink(item.href, mode === 'home' ? navLinkClass(item.key) : subNavLinkClass(item.key), item.label)}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={dark}
          >
            {dark ? <MoonIcon /> : <SunIcon />}
          </button>

          {renderLink(
            mode === 'home' ? '#contact' : '/#contact',
            'hidden md:inline-flex items-center gap-2 shimmer bg-accent text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-accent-light transition-colors',
            <>
              Hire me <ArrowRightIcon />
            </>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950 md:hidden"
        >
          <ul className="flex flex-col gap-4 px-6 py-5 text-sm font-medium">
            {items.map((item) => (
              <li key={item.key}>
                {renderLink(
                  item.href,
                  'block text-zinc-700 dark:text-zinc-300 hover:text-accent transition-colors',
                  item.label,
                  closeMenu
                )}
              </li>
            ))}
            <li className="border-t border-zinc-100 pt-2 dark:border-zinc-900">
              {renderLink(
                mode === 'home' ? '#contact' : '/#contact',
                'inline-flex shimmer bg-accent text-white font-medium text-sm px-5 py-2.5 rounded-full',
                'Hire me →',
                closeMenu
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
