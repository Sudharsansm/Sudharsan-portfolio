import { useState } from 'react'
import { MailIcon, LinkedInIcon, GitHubIcon } from '../components/Icons.jsx'
import { SITE } from '../config/site.js'

const REQUEST_TIMEOUT_MS = 15000

const STATUS_MESSAGES = {
  sent: "Thanks! Your message has been sent — I'll get back to you within two business days.",
  error: `Something went wrong sending your message. Please try again, or email me directly at ${SITE.email}.`,
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return

    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot: real visitors never fill this hidden field; bots do. Pretend success and drop it.
    if (data.get('_gotcha')) {
      setStatus('sent')
      form.reset()
      return
    }

    setStatus('sending')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })

      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      clearTimeout(timer)
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-10 dark:bg-zinc-800 md:p-16">
          <div
            className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative z-10 grid items-start gap-12 md:grid-cols-2">
            <div>
              <h2 className="reveal d1 mb-5 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
                Let's work
                <br />
                together
              </h2>
              <p className="reveal d2 mb-8 leading-relaxed text-zinc-400">
                I'm open to AI/ML engineering and software development opportunities, short or long-term. Whether it's
                building intelligent applications, developing AI-powered products or solving complex technical
                challenges — let's connect.
              </p>
              <div className="reveal d3 flex flex-col gap-4">
                <a
                  href={`mailto:${SITE.email}`}
                  className="group flex items-center gap-3 text-zinc-400 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 transition-colors group-hover:bg-accent/20">
                    <MailIcon />
                  </span>
                  <span className="text-sm">{SITE.email}</span>
                </a>
                <a
                  href={SITE.linkedin}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="group flex items-center gap-3 text-zinc-400 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 transition-colors group-hover:bg-accent/20">
                    <LinkedInIcon />
                  </span>
                  <span className="text-sm">www.linkedin.com/in/sudharsansm</span>
                </a>
                <a
                  href={SITE.github}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="group flex items-center gap-3 text-zinc-400 transition-colors hover:text-white"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800 transition-colors group-hover:bg-accent/20">
                    <GitHubIcon />
                  </span>
                  <span className="text-sm">www.github.com/sudharsansm</span>
                </a>
              </div>
            </div>

            <div className="reveal d2">
              <form onSubmit={handleSubmit} noValidate={false} aria-busy={status === 'sending'}>
                {/* Honeypot field — hidden from people and assistive tech */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="fgotcha">Leave this field empty</label>
                  <input type="text" id="fgotcha" name="_gotcha" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fname" className="mb-1.5 block text-xs font-medium text-zinc-400">
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        type="text"
                        id="fname"
                        name="name"
                        maxLength={100}
                        placeholder="Your name"
                        required
                        autoComplete="name"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="femail" className="mb-1.5 block text-xs font-medium text-zinc-400">
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        type="email"
                        id="femail"
                        name="email"
                        placeholder="you@company.com"
                        required
                        autoComplete="email"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="fsubject" className="mb-1.5 block text-xs font-medium text-zinc-400">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="fsubject"
                      name="subject"
                      placeholder="Project inquiry"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="fmessage" className="mb-1.5 block text-xs font-medium text-zinc-400">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="fmessage"
                      name="message"
                      rows={6}
                      maxLength={5000}
                      placeholder="Tell me about your project..."
                      required
                      className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors focus:border-accent focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="shimmer w-full rounded-xl bg-accent py-3.5 font-display text-sm font-bold text-white transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message →'}
                  </button>
                  <p
                    role="status"
                    aria-live="polite"
                    className={`min-h-[1.25rem] text-sm ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
                  >
                    {STATUS_MESSAGES[status] ?? ''}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
