import services from '../data/services.json'

export default function Services() {
  return (
    <section id="services" className="bg-zinc-50 py-24 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14">
          <p className="reveal mb-3 text-xs font-medium uppercase tracking-widest text-accent">What I do</p>
          <h2 className="reveal d1 font-display text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
            Services
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className={`reveal ${service.delay} card-h group rounded-2xl border p-8 hover:border-accent ${
                service.dark
                  ? 'border-zinc-800 bg-zinc-900 dark:bg-zinc-800'
                  : 'border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div
                className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  service.dark
                    ? 'bg-zinc-800 group-hover:bg-accent/20 dark:bg-zinc-700'
                    : 'bg-orange-50 group-hover:bg-accent/10 dark:bg-zinc-800'
                }`}
              >
                <svg
                  className="h-6 w-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {service.icon.map((d) => (
                    <path key={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
                  ))}
                </svg>
              </div>
              <h3
                className={`mb-3 font-display text-xl font-bold ${service.dark ? 'text-white' : 'text-zinc-900 dark:text-white'}`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${service.dark ? 'text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'}`}
              >
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
