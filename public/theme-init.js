// Runs synchronously from <head> so the correct theme is applied before first paint (no flash).
// Kept as an external file so the site can ship a strict Content-Security-Policy (no inline scripts).
;(function () {
  try {
    var stored = localStorage.getItem('theme')
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', dark)
  } catch (e) {}
})()
