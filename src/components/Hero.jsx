import { ArrowRightIcon } from '../components/Icons.jsx'

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 left-0 h-64 w-64 rounded-full bg-zinc-200/50 blur-3xl dark:bg-zinc-800/30"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="reveal mb-4 text-sm font-medium uppercase tracking-widest text-accent">Available for work</p>
            <h1 className="reveal d1 mb-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-zinc-900 dark:text-white md:text-6xl lg:text-7xl">
              Hi, I'm <span className="text-accent"> Sudharsan </span>
            </h1>
            <p className="reveal d2 mb-10 max-w-md text-lg font-light leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-xl">
              Freelance{' '}
              <strong className="font-medium text-zinc-700 dark:text-zinc-300">
                AI/ML Engineer &amp; Python Developer
              </strong>
              . I build intelligent and crazy applications and scalable digital products using AI, Python, and modern
              technologies — turning ideas into practical, impactful solutions.
            </p>
            <div className="reveal d3 flex flex-wrap gap-4">
              <a
                href="#work"
                className="shimmer inline-flex items-center gap-2 rounded-full bg-zinc-900 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                View my work
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-7 py-3.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Get in touch
              </a>
            </div>
            <div className="reveal d4 mt-14 flex gap-8 border-t border-zinc-100 pt-0 dark:border-zinc-900">
              <div>
                <p className="font-display text-3xl font-bold text-zinc-900 dark:text-white">10+</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Projects done</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-zinc-900 dark:text-white">21+</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Happy clients</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-zinc-900 dark:text-white">1y</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Experience</p>
              </div>
            </div>
          </div>
          <div className="reveal d2 flex justify-center md:justify-end">
            <div className="relative h-72 w-72 md:h-80 md:w-80 lg:h-96 lg:w-96">
              <div className="pf h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/images/sudharsan.webp"
                  alt="Portrait of Sudharsan SM, AI/ML Engineer & Python Developer"
                  width="1000"
                  height="750"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <a
                href="/document/sudharsan_sm_resume.pdf"
                download="Sudharsan_SM_Resume.pdf"
                aria-label="Download Sudharsan's resume"
                title="Download Resume"
                className="absolute -bottom-6 -left-6 z-10 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              >
                <span className="flex flex-col items-center justify-center gap-1 text-center">
                  <span className="text-[12px] font-bold leading-tight">
                    Download
                    <br />
                    Resume
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
