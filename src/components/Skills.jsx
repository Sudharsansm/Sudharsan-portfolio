import STACK from '../data/skills.json'
import SafeImage from '../components/SafeImage.jsx'

export default function Skills() {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14">
          <p className="reveal mb-3 text-xs font-medium uppercase tracking-widest text-accent">Stack &amp; tools</p>
          <h2 className="reveal d1 font-display text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
            What I Know
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {STACK.map((t) => (
            <div
              key={t.id}
              className={`reveal ${t.delay} flex min-h-[110px] items-center rounded-2xl border p-4 ${
                t.dark
                  ? 'border-zinc-800 bg-zinc-900 dark:bg-zinc-800'
                  : 'border-zinc-400 bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="pf h-10 w-10 shrink-0 rounded-full">
                  <SafeImage src={t.avatar} alt="" loading="lazy" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${t.dark ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
