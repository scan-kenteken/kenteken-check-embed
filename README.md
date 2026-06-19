# Kenteken Check

Lightweight embed widget for inline kentekenchecks on any website. A vanilla TypeScript custom element with Shadow DOM — no framework, iframe, or scanner required.

<p align="center">
  <img src="assets/demo.gif" alt="Kenteken Check widget — type a Dutch plate and see vehicle details inline" width="380" />
</p>

## Embed

```html
<script async src="https://cdn.scankenteken.nl/kenteken-check/v1/embed.js"></script>
<kenteken-check preset="garage"></kenteken-check>
```

## Presets

| Preset | Fields |
|---|---|
| `garage` | brand, apk |
| `dealer` | brand, apk, price |
| `fleet` | brand, euro |
| `full` | brand, apk, price, euro |

Override fields explicitly:

```html
<kenteken-check fields="brand,apk,price" layout="compact"></kenteken-check>
```

## Attributes

| Attribute | Default | Values |
|---|---|---|
| `preset` | `garage` | `garage`, `dealer`, `fleet`, `full` |
| `fields` | *(from preset)* | comma-separated: `brand`, `apk`, `price`, `euro` (`ze` reserved for a future release) |
| `layout` | `card` | `compact`, `card` |
| `theme` | `auto` | `light`, `dark`, `auto` |
| `plate` | — | pre-fill and auto-lookup, e.g. `XX-123-X` |
| `show-input` | `true` | `true`, `false` |
| `link-out` | `true` | link plate to ScanKenteken detail page |
| `attribution` | `true` | show footer attribution |
| `api-base` | `https://api.scankenteken.nl` | API origin |

### Layout behaviour

- **compact** — hides rows when data is unavailable
- **card** — shows `onbekend` for enabled fields without data

### Examples

Garage workshop page with a fixed plate:

```html
<kenteken-check
  preset="garage"
  plate="G-123-BB"
  show-input="false"
  layout="compact"
></kenteken-check>
```

Dealer listing with price:

```html
<kenteken-check preset="dealer" plate="G-123-BB" show-input="false"></kenteken-check>
```

Fleet dashboard (Euroklasse):

```html
<kenteken-check preset="fleet"></kenteken-check>
```

Dark theme:

```html
<kenteken-check theme="dark"></kenteken-check>
```

## Local development

```sh
npm install
npm run build
npm run serve
```

Open the configurator:

- http://localhost:3000/configurator/

Watch mode:

```sh
npm run dev
```

## Build output

- `dist/embed.js` — single IIFE bundle for CDN `<script>` embedding
- Target: under 20 KB gzipped

## Data source

Vehicle data is fetched from `GET {api-base}/api/vehicles/:plate`. Rate limiting and caching are handled by `api.scankenteken.nl`.

## License

MIT
