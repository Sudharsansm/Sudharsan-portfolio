import { useEffect, useState } from 'react'

// Highlights the nav link for whichever section is currently in view.
// `ids` must be a stable reference (module-level constant) — pass nothing/empty to disable.
export default function useSectionSpy(ids) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (!ids.length) return undefined

    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 60
      if (atBottom) {
        setActive(ids[ids.length - 1])
        return
      }
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && window.scrollY >= el.offsetTop - 130) {
          setActive(ids[i])
          return
        }
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [ids])

  return active
}
