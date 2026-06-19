const EU_STARS =
  '<svg class="eu-stars" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><text x="50" y="17" text-anchor="middle" dominant-baseline="central">★</text><text x="66.5" y="21.4" text-anchor="middle" dominant-baseline="central">★</text><text x="78.6" y="33.5" text-anchor="middle" dominant-baseline="central">★</text><text x="83" y="50" text-anchor="middle" dominant-baseline="central">★</text><text x="78.6" y="66.5" text-anchor="middle" dominant-baseline="central">★</text><text x="66.5" y="78.6" text-anchor="middle" dominant-baseline="central">★</text><text x="50" y="83" text-anchor="middle" dominant-baseline="central">★</text><text x="33.5" y="78.6" text-anchor="middle" dominant-baseline="central">★</text><text x="21.4" y="66.5" text-anchor="middle" dominant-baseline="central">★</text><text x="17" y="50" text-anchor="middle" dominant-baseline="central">★</text><text x="21.4" y="33.5" text-anchor="middle" dominant-baseline="central">★</text><text x="33.5" y="21.4" text-anchor="middle" dominant-baseline="central">★</text></svg>'

export function createEuStrip(): HTMLElement {
  const eu = document.createElement('div')
  eu.className = 'plate-eu'
  eu.innerHTML = `${EU_STARS}<span class="plate-country">NL</span>`
  return eu
}
