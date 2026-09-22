const platformLinks = {
  windows: 'windows-x86_64',
  mac: 'darwin-aarch64',
}

async function loadRelease() {
  try {
    const response = await fetch('latest.json', { cache: 'no-store' })
    if (!response.ok) return
    const release = await response.json()
    const version = `v${release.version}`
    document.querySelectorAll('[data-version]').forEach((element) => { element.textContent = version })
    document.querySelectorAll('[data-date]').forEach((element) => {
      element.textContent = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(release.pub_date)).toUpperCase()
    })
    Object.entries(platformLinks).forEach(([name, platform]) => {
      const url = release.platforms?.[platform]?.url
      if (url) document.querySelectorAll(`[data-download="${name}"]`).forEach((link) => { link.href = url })
    })
  } catch {
    // The static fallback links keep downloads available if the update feed is unreachable.
  }
}

loadRelease()

const hero = document.querySelector('.hero')
const slideTrack = document.querySelector('.slide-track')
const slideControls = document.querySelectorAll('.slide-control')
let activeSlide = 0
let slideTimer
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function showSlide(index) {
  activeSlide = index
  slideTrack.style.transform = `translateX(-${activeSlide * 50}%)`
  slideControls.forEach((control, controlIndex) => {
    const isActive = controlIndex === activeSlide
    control.classList.toggle('active', isActive)
    control.setAttribute('aria-current', isActive ? 'true' : 'false')
  })
}

function startSlideTimer() {
  if (reduceMotion) return
  window.clearInterval(slideTimer)
  slideTimer = window.setInterval(() => showSlide((activeSlide + 1) % slideControls.length), 7000)
}

slideControls.forEach((control) => control.addEventListener('click', () => {
  showSlide(Number(control.dataset.slide))
  startSlideTimer()
}))

hero.addEventListener('mouseenter', () => window.clearInterval(slideTimer))
hero.addEventListener('mouseleave', startSlideTimer)
hero.addEventListener('focusin', () => window.clearInterval(slideTimer))
hero.addEventListener('focusout', startSlideTimer)
startSlideTimer()
