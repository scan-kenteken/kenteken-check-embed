export const SEARCH_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'

export function createSearchButton(): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'submit'
  button.className = 'plate-search'
  button.setAttribute('aria-label', 'Zoeken')
  button.innerHTML = SEARCH_ICON
  return button
}

export function createApkIcon(valid: boolean): HTMLElement {
  const icon = document.createElement('span')
  icon.className = valid ? 'apk-icon apk-icon-ok' : 'apk-icon apk-icon-bad'
  icon.setAttribute('aria-hidden', 'true')
  icon.innerHTML = valid
    ? '<svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="currentColor" opacity="0.2"/><path d="M3.4 6.1l1.7 1.7 3.5-3.9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="currentColor" opacity="0.2"/><path d="M4.1 4.1l3.8 3.8M7.9 4.1l-3.8 3.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
  return icon
}
