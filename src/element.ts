import { fetchVehicle } from './api'
import { readConfig } from './config'
import { buildFieldRows, visibleRows } from './fields'
import { formatPlateDisplay, formatPlateInput, normalizePlate } from './format'
import { getEmbedAssetBase, kentekenFontFace } from './font'
import { createEuStrip, createPlateDisplay } from './plate'
import { createApkIcon, createSearchButton } from './icons'
import { buildStyles } from './styles'
import type { FetchError, VehicleResponse, WidgetConfig } from './types'

const TAG = 'kenteken-check'
const MAX_PLATE_LEN = 6

export class KentekenCheckElement extends HTMLElement {
  static observedAttributes = [
    'preset',
    'fields',
    'layout',
    'theme',
    'plate',
    'show-input',
    'link-out',
    'attribution',
    'api-base',
  ] as const

  #config!: WidgetConfig
  #shell!: HTMLElement
  #form!: HTMLFormElement
  #input!: HTMLInputElement
  #submit!: HTMLButtonElement
  #plateLabel!: HTMLLabelElement
  #status!: HTMLParagraphElement
  #plateDisplay!: HTMLElement
  #results!: HTMLElement
  #footer!: HTMLElement
  #currentPlate: string | null = null
  #cache: { plate: string; apiBase: string; data: VehicleResponse } | null = null
  #abort: AbortController | null = null
  #requestId = 0
  #themeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  #onThemeChange = (): void => this.#applyTheme()
  #onInput = (): void => this.#syncPlateInput()
  #onKeyDown = (event: KeyboardEvent): void => this.#handlePlateKeyDown(event)
  #onPaste = (event: ClipboardEvent): void => this.#handlePlatePaste(event)

  connectedCallback(): void {
    if (!this.shadowRoot) {
      const root = this.attachShadow({ mode: 'open' })
      const style = document.createElement('style')
      style.textContent = buildStyles(kentekenFontFace(getEmbedAssetBase()))

      this.#shell = document.createElement('div')
      this.#shell.className = 'shell'

      this.#form = document.createElement('form')
      this.#form.setAttribute('part', 'form')

      this.#plateLabel = document.createElement('label')
      this.#plateLabel.className = 'plate plate-input plate-yellow'

      this.#input = document.createElement('input')
      this.#input.type = 'text'
      this.#input.name = 'plate'
      this.#input.autocomplete = 'off'
      this.#input.spellcheck = false
      this.#input.placeholder = 'XX-123-X'
      this.#input.setAttribute('aria-label', 'Kenteken')
      this.#input.setAttribute('autocapitalize', 'characters')
      this.#input.inputMode = 'text'

      this.#submit = createSearchButton()

      this.#plateLabel.append(createEuStrip(), this.#input, this.#submit)

      this.#form.append(this.#plateLabel)
      this.#form.addEventListener('submit', (event) => {
        event.preventDefault()
        void this.#lookup(this.#input.value)
      })

      this.#input.addEventListener('input', this.#onInput)
      this.#input.addEventListener('keydown', this.#onKeyDown)
      this.#input.addEventListener('paste', this.#onPaste)

      this.#status = document.createElement('p')
      this.#status.className = 'status'
      this.#status.hidden = true

      this.#plateDisplay = document.createElement('div')
      this.#plateDisplay.className = 'plate-wrap'
      this.#plateDisplay.hidden = true

      this.#results = document.createElement('div')
      this.#results.className = 'results'
      this.#results.hidden = true

      this.#footer = document.createElement('p')
      this.#footer.className = 'footer'
      this.#footer.hidden = true

      this.#shell.append(this.#form, this.#status, this.#plateDisplay, this.#results, this.#footer)
      root.append(style, this.#shell)
    }

    this.#themeQuery.addEventListener('change', this.#onThemeChange)
    this.#sync()
  }

  disconnectedCallback(): void {
    this.#themeQuery.removeEventListener('change', this.#onThemeChange)
    this.#input.removeEventListener('input', this.#onInput)
    this.#input.removeEventListener('keydown', this.#onKeyDown)
    this.#input.removeEventListener('paste', this.#onPaste)
    this.#abort?.abort()
    this.#abort = null
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) return
    this.#sync()
  }

  #sync(): void {
    this.#config = readConfig(this)
    this.#applyTheme()
    this.#shell.dataset.layout = this.#config.layout
    this.#form.hidden = !this.#config.showInput
    this.#footer.hidden = !this.#config.attribution
    this.#updateFooter()

    if (!this.#config.plate) {
      this.#clearResults()
      return
    }

    const normPlate = normalizePlate(this.#config.plate)
    this.#setPlateInput(this.#config.plate)

    if (
      this.#cache &&
      this.#cache.plate === normPlate &&
      this.#cache.apiBase === this.#config.apiBase
    ) {
      this.#renderSuccess(this.#cache.data, normPlate)
      return
    }

    void this.#lookup(this.#config.plate)
  }

  #applyTheme(): void {
    this.dataset.theme = this.#config.theme
  }

  #setPlateInput(raw: string): void {
    this.#input.value = formatPlateInput(raw)
  }

  #syncPlateInput(): void {
    this.#input.value = formatPlateInput(this.#input.value)
  }

  #handlePlateKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
    if (allowed.includes(event.key)) return

    const norm = normalizePlate(this.#input.value)
    if (norm.length >= MAX_PLATE_LEN && event.key.length === 1) {
      event.preventDefault()
    }
  }

  #handlePlatePaste(event: ClipboardEvent): void {
    event.preventDefault()
    const pasted = event.clipboardData?.getData('text') ?? ''
    const norm = normalizePlate(this.#input.value + pasted).slice(0, MAX_PLATE_LEN)
    this.#setPlateInput(norm)
  }

  async #lookup(rawPlate: string): Promise<void> {
    const plate = normalizePlate(rawPlate)
    const requestId = ++this.#requestId
    this.#abort?.abort()
    this.#abort = new AbortController()

    this.#setLoading(true)
    this.#showStatus('Gegevens ophalen…', 'loading')

    const result = await fetchVehicle(this.#config.apiBase, plate, this.#abort.signal).catch(
      (error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return null
        }
        throw error
      },
    )
    if (result === null || requestId !== this.#requestId) return

    this.#setLoading(false)

    if (!result.ok) {
      this.#showError(result.error)
      return
    }

    this.#renderSuccess(result.data, plate)
  }

  #setLoading(loading: boolean): void {
    this.#submit.disabled = loading
    this.#input.disabled = loading
  }

  #showStatus(message: string, kind: 'loading' | 'error'): void {
    this.#status.hidden = false
    this.#status.dataset.kind = kind
    this.#status.textContent = message
    this.#plateDisplay.hidden = true
    this.#results.hidden = true
  }

  #showError(error: FetchError): void {
    this.#showStatus(error.message, 'error')
  }

  #clearResults(): void {
    this.#status.hidden = true
    this.#plateDisplay.hidden = true
    this.#results.hidden = true
    this.#results.replaceChildren()
    this.#currentPlate = null
    this.#cache = null
    this.#updateFooter()
  }

  #renderSuccess(data: VehicleResponse, plate: string): void {
    this.#cache = { plate, apiBase: this.#config.apiBase, data }
    this.#status.hidden = true

    const displayPlate = formatPlateDisplay(data.kenteken_norm ?? plate)
    this.#currentPlate = displayPlate
    this.#updateFooter()
    if (this.#config.showInput) {
      this.#plateDisplay.hidden = true
      this.#plateDisplay.replaceChildren()
    } else {
      this.#renderPlateDisplay(displayPlate)
      this.#plateDisplay.hidden = false
    }

    const rows = visibleRows(buildFieldRows(this.#config.fields, data), this.#config.layout)
    this.#results.replaceChildren()

    const showLinkRow = this.#config.linkOut && this.#currentPlate
    if (rows.length === 0 && this.#config.layout === 'compact' && !showLinkRow) {
      this.#results.hidden = true
      return
    }

    for (const row of rows) {
      const label = document.createElement('span')
      label.className = 'label'
      label.textContent = row.label

      const value = document.createElement('span')
      value.className = 'value'
      if (row.key === 'apk' && row.value && row.apkValid != null) {
        value.classList.add('value-apk')
        value.append(createApkIcon(row.apkValid), document.createTextNode(row.value))
      } else {
        value.textContent = row.value ?? 'onbekend'
      }

      const wrap = document.createElement('div')
      wrap.className = 'row'
      wrap.append(label, value)
      this.#results.append(wrap)
    }

    if (showLinkRow) {
      const linkRow = document.createElement('div')
      linkRow.className = 'more-link-wrap'
      const link = document.createElement('a')
      link.className = 'more-link'
      link.href = this.#detailUrl(displayPlate)
      link.rel = 'noopener noreferrer'
      link.target = '_blank'
      link.textContent = 'Meer details'
      linkRow.append(link)
      this.#results.append(linkRow)
    }

    this.#results.hidden = false
  }

  #renderPlateDisplay(displayPlate: string): void {
    this.#plateDisplay.replaceChildren()
    const href = this.#config.linkOut ? this.#detailUrl(displayPlate) : undefined
    this.#plateDisplay.append(createPlateDisplay(displayPlate, href))
  }

  #detailUrl(displayPlate: string): string {
    const slug = encodeURIComponent(normalizePlate(displayPlate))
    return `https://www.scankenteken.nl/kenteken/${slug}?utm_source=embed`
  }

  #updateFooter(): void {
    if (!this.#config?.attribution) return

    const siteUrl = 'https://www.scankenteken.nl/?utm_source=embed'
    this.#footer.innerHTML =
      'Kentekencheck via <a href="' +
      siteUrl +
      '" rel="noopener noreferrer" target="_blank">ScanKenteken</a> (RDW-data)'
  }
}

export function defineKentekenCheck(tag = TAG): void {
  if (customElements.get(tag)) return
  customElements.define(tag, KentekenCheckElement)
}
