export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="text-sm text-zinc-400">
          © <span>{new Date().getFullYear()}</span> Sudharsan. All rights reserved. <br /> Developed by{' '}
          <a
            href="https://www.linkedin.com/company/bitsophia-ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold"
          >
            Bitsophia
          </a>{' '}
          • Research-driven AI. Built on wisdom.
        </p>
        <p className="text-xs text-zinc-500">
          Built with{' '}
          <a
            href="https://tailwindcss.com"
            rel="noopener noreferrer"
            target="_blank"
            className="transition-colors hover:text-accent"
          >
            Tailwind CSS
          </a>{' '}
          &amp;{' '}
          <a
            href="https://react.dev"
            rel="noopener noreferrer"
            target="_blank"
            className="transition-colors hover:text-accent"
          >
            React
          </a>
        </p>
      </div>
    </footer>
  )
}
