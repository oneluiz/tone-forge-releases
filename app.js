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
      element.textContent = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(release.pub_date)).toUpperCase()
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
