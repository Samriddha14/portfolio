// ============================================================================
// Portfolio v2 — all the behaviour in one small file.
// Each part is independent; delete any part you don't want.
// ============================================================================

/* ----------------------------------------------------------------------------
   1. LIGHT / DARK THEME TOGGLE
   Switches <html data-theme> and remembers the choice in localStorage.
   ---------------------------------------------------------------------------- */
const themeToggle = document.getElementById('theme-toggle')

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
  // keep the button label in sync
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
  )
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme
  applyTheme(current === 'dark' ? 'light' : 'dark')
})

/* ----------------------------------------------------------------------------
   2. MOBILE MENU
   Opens and closes the dropdown list of links on small screens.
   ---------------------------------------------------------------------------- */
const burger = document.getElementById('nav-burger')
const mobileMenu = document.getElementById('nav-mobile')

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open')
  burger.setAttribute('aria-expanded', isOpen)
  burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
})

// close the menu when a link in it is tapped
mobileMenu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => mobileMenu.classList.remove('open')),
)

/* ----------------------------------------------------------------------------
   3. NAVBAR BACKGROUND ON SCROLL
   Adds .scrolled once you've scrolled a little way down the page.
   ---------------------------------------------------------------------------- */
const nav = document.getElementById('nav')

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 12)
})

/* ----------------------------------------------------------------------------
   4. HIGHLIGHT THE ACTIVE NAV LINK
   Watches which section is on screen and highlights its link.
   ---------------------------------------------------------------------------- */
const sections = [...document.querySelectorAll('section[id]')]

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      // remove .active from every link, then add it to the current section's link
      document.querySelectorAll('.nav-links a, .nav-mobile a').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
      })
    })
  },
  { rootMargin: '-35% 0px -55% 0px' }, // trigger near the middle of the screen
)

sections.forEach((section) => sectionObserver.observe(section))

/* ----------------------------------------------------------------------------
   5. SCROLL-REVEAL ANIMATIONS
   Elements with class .reveal fade in the first time they enter the viewport.
   ---------------------------------------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal')

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target) // only animate once
      }
    })
  },
  { threshold: 0.15 },
)

revealElements.forEach((el) => revealObserver.observe(el))

// if the user prefers reduced motion, just show everything now
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealElements.forEach((el) => el.classList.add('is-visible'))
}

/* ----------------------------------------------------------------------------
   6. CONTACT FORM — Web3Forms
   ---------------------------------------------------------------------------- */
const form = document.getElementById('contact-form')
const formNote = document.getElementById('form-note')
const submitBtn = form.querySelector('button[type="submit"]')

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  submitBtn.disabled = true
  submitBtn.textContent = 'Sending…'

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form),
    })
    const data = await res.json()
    formNote.hidden = false
    formNote.textContent = data.success
      ? '✓ Message sent! I\'ll get back to you soon.'
      : 'Something went wrong — try emailing me directly.'
    if (data.success) form.reset()
  } catch {
    formNote.hidden = false
    formNote.textContent = 'Network error — try emailing me directly.'
  } finally {
    submitBtn.disabled = false
    submitBtn.textContent = 'Send Message'
  }
})
