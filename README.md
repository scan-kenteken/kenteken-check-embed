# Kenteken Check

Lightweight embed widget for inline kentekenchecks on any website. Shows public vehicle details from the Dutch RDW vehicle register — merk, model, APK date, and more. A vanilla TypeScript custom element with Shadow DOM — no framework, iframe, or scanner required.

**Configure fields, theme, and copy embed code:** [scankenteken.nl/kenteken-check-embed](https://www.scankenteken.nl/kenteken-check-embed)

<p align="center">
  <img src="assets/demo.gif" alt="Kenteken Check widget — type a Dutch plate and see vehicle details inline" width="380" />
</p>

## Embed

```html
<script async src="https://cdn.scankenteken.nl/kenteken-check/v1/embed.js"></script>
<kenteken-check></kenteken-check>
```

## Attributes

| Attribute | Default | Values |
|---|---|---|
| `fields` | `brand,apk,link` | comma-separated: `brand`, `apk`, `price`, `euro`, `link` |
| `theme` | `auto` | `light`, `dark`, `auto` |
| `plate` | — | pre-fill and auto-lookup, e.g. `RJ-123-X` |

## Examples

Show price alongside brand and APK:

```html
<kenteken-check fields="brand,apk,price"></kenteken-check>
```

Pre-filled, dark theme:

```html
<kenteken-check plate="RJ-123-X" theme="dark"></kenteken-check>
```

## ESM module

For bundlers (Vite, Next.js, etc.) or a module script on the page:

```js
import { defineKentekenCheck } from 'kenteken-check-embed'

defineKentekenCheck()
```

```html
<kenteken-check fields="brand,apk,link"></kenteken-check>
```

CDN module import (no bundler):

```html
<script type="module">
  import { defineKentekenCheck } from 'https://cdn.scankenteken.nl/kenteken-check/v1/index.js'
  defineKentekenCheck()
</script>
<kenteken-check></kenteken-check>
```

The classic script tag embed (`embed.js`) still works and auto-registers the element:

```html
<script async src="https://cdn.scankenteken.nl/kenteken-check/v1/embed.js"></script>
```

## Local development

```sh
npm install
npm run build
npm run serve
```

Open the live configurator to preview and copy embed code:

- https://www.scankenteken.nl/kenteken-check-embed

For local development, the same configurator is available at http://localhost:3000/configurator/ after `npm run serve`.

Watch mode:

```sh
npm run dev
```

## Data source

Vehicle data comes from the public [RDW](https://www.rdw.nl/) (Rijksdienst voor het Wegverkeer) open vehicle register. The widget fetches it via `https://api.scankenteken.nl/api/vehicles/:plate`. Rate limiting and caching are handled server-side.

ScanKenteken is not part of the RDW. No personal owner data is shown.

## License

MIT
