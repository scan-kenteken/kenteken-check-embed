const EU_STARS =
  '<svg class="eu-stars" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><text x="50" y="17" text-anchor="middle" dominant-baseline="central">★</text><text x="66.5" y="21.4" text-anchor="middle" dominant-baseline="central">★</text><text x="78.6" y="33.5" text-anchor="middle" dominant-baseline="central">★</text><text x="83" y="50" text-anchor="middle" dominant-baseline="central">★</text><text x="78.6" y="66.5" text-anchor="middle" dominant-baseline="central">★</text><text x="66.5" y="78.6" text-anchor="middle" dominant-baseline="central">★</text><text x="50" y="83" text-anchor="middle" dominant-baseline="central">★</text><text x="33.5" y="78.6" text-anchor="middle" dominant-baseline="central">★</text><text x="21.4" y="66.5" text-anchor="middle" dominant-baseline="central">★</text><text x="17" y="50" text-anchor="middle" dominant-baseline="central">★</text><text x="21.4" y="33.5" text-anchor="middle" dominant-baseline="central">★</text><text x="33.5" y="21.4" text-anchor="middle" dominant-baseline="central">★</text></svg>'

export function createEuStrip(): HTMLElement {
  const eu = document.createElement('div')
  eu.className = 'plate-eu'
  eu.innerHTML = `${EU_STARS}<span class="plate-country">NL</span>`
  return eu
}

export function createPlateFlow(value: string): HTMLElement {
  const flow = document.createElement('char-flow')
  flow.className = 'plate-flow'
  flow.setAttribute('preset', 'plate')
  flow.setAttribute('value', value)
  flow.style.color = '#1a2028'
  return flow
}

export function createPlateDisplay(displayPlate: string, href?: string): HTMLElement {
  const plate = document.createElement(href ? 'a' : 'div')
  plate.className = 'plate plate-display plate-yellow plate-chip'
  if (href) {
    const link = plate as HTMLAnchorElement
    link.href = href
    link.rel = 'noopener noreferrer'
    link.target = '_blank'
    link.setAttribute('aria-label', `Kenteken ${displayPlate} op ScanKenteken`)
    plate.classList.add('plate-link')
  }

  const text = document.createElement('div')
  text.className = 'plate-text'
  text.append(createPlateFlow(displayPlate))

  plate.append(createEuStrip(), text)
  return plate
}
