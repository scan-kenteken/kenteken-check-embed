import { KENTEKEN_FONT } from './font'

const PLATE_STYLES = `
.plate {
  --plate-scale: 1;
  background: #f7bd00;
  border: 2px solid #17202c;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px #c08d00, 0 6px 16px #15397714;
  container-type: inline-size;
}

.plate-yellow {
  background: #f7bd00;
  border-color: #17202c;
  color: #1a2028;
}

.plate-eu {
  width: calc(34px * var(--plate-scale));
  min-width: calc(34px * var(--plate-scale));
  font-family: Arial, Helvetica, sans-serif;
  background: #0644b2;
  flex: none;
  position: relative;
}

.eu-stars {
  aspect-ratio: 1;
  color: #ffe000;
  width: 56%;
  display: block;
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translate(-50%);
}

.eu-stars text {
  fill: currentColor;
  font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px * var(--plate-scale));
  font-weight: 700;
}

.plate-country {
  color: #fff;
  font-size: calc(0.72rem * var(--plate-scale));
  font-weight: 400;
  line-height: 1;
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
}

.plate-input input {
  color: #1a2028;
  min-width: 0;
  font-family: ${KENTEKEN_FONT};
  font-size: clamp(
    calc(0.92rem * var(--plate-scale)),
    calc((100cqi - 34px * var(--plate-scale)) / 8.2),
    calc(1.35rem * var(--plate-scale))
  );
  font-weight: 400;
  letter-spacing: normal;
  text-transform: uppercase;
  text-shadow: none;
  line-height: 1;
  white-space: nowrap;
}

.plate-input {
  --plate-scale: 1;
  display: flex;
  width: 100%;
  max-width: none;
  height: 44px;
  cursor: text;
}

.plate-input input {
  flex: 1;
  text-align: center;
  background: transparent;
  border: 0;
  outline: 0;
  padding: 0 4%;
  cursor: text;
}

.plate-input input::placeholder {
  color: #06090d6b;
}

.plate-input:focus-within {
  outline: 2px solid rgba(18, 98, 223, 0.28);
  outline-offset: 2px;
}
`.trim()

const SHELL_STYLES = `
:host {
  display: block;
  width: 100%;
  max-width: 100%;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: var(--sk-text);
  --sk-text: #1a1615;
  --sk-muted: #7a6a5e;
  --sk-bg: #ffffff;
  --sk-surface: #faf5f0;
  --sk-border: rgba(26, 22, 21, 0.14);
  --sk-accent: #1262df;
  --sk-error: #b3261e;
  --sk-radius: 8px;
}

:host([data-theme='dark']) {
  --sk-text: #f0f0f0;
  --sk-muted: #b8b8b8;
  --sk-bg: #1c1c1c;
  --sk-surface: #262626;
  --sk-border: #404040;
  --sk-accent: #8ab4f8;
  --sk-error: #f2b8b5;
}

@media (prefers-color-scheme: dark) {
  :host([data-theme='auto']) {
    --sk-text: #f0f0f0;
    --sk-muted: #b8b8b8;
    --sk-bg: #1c1c1c;
    --sk-surface: #262626;
    --sk-border: #404040;
    --sk-accent: #8ab4f8;
    --sk-error: #f2b8b5;
  }
}

*, *::before, *::after {
  box-sizing: border-box;
}

.shell {
  background: var(--sk-bg);
  border: 1px solid var(--sk-border);
  border-radius: var(--sk-radius);
  padding: 12px;
  width: 100%;
}

.shell[data-layout='compact'] {
  border: none;
  padding: 0;
  background: transparent;
}

form {
  display: block;
  width: 100%;
  margin-bottom: 14px;
}

form[hidden] {
  display: none;
}

.plate-search {
  flex: none;
  width: 40px;
  height: calc(100% - 10px);
  margin: 5px 6px 5px 0;
  padding: 0;
  border: 0;
  border-left: 1px solid #11254e1a;
  border-radius: 6px;
  background: #1262df14;
  color: #1262df;
  cursor: pointer;
  display: grid;
  place-items: center;
  align-self: center;
}

.plate-search:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.plate-search svg {
  width: 20px;
  height: 20px;
  display: block;
}

.results {
  margin: 0;
  display: grid;
  gap: 8px;
}

.shell[data-layout='card'] .results {
  gap: 0;
}

.row {
  display: grid;
  grid-template-columns: minmax(0, 42%) 1fr;
  gap: 8px 12px;
  padding: 8px 0;
  border-top: 1px solid var(--sk-border);
}

.row:first-child {
  border-top: none;
  padding-top: 0;
}

.shell[data-layout='compact'] .row {
  border-top: none;
  padding: 2px 0;
}

.label {
  margin: 0;
  color: var(--sk-muted);
  font-weight: 500;
}

.value {
  margin: 0;
  font-weight: 600;
}

.value-apk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.apk-icon {
  flex: none;
  width: 14px;
  height: 14px;
  line-height: 0;
}

.apk-icon svg {
  display: block;
  width: 14px;
  height: 14px;
}

.apk-icon-ok {
  color: #16803c;
}

.apk-icon-bad {
  color: var(--sk-error);
}

.more-link-wrap {
  margin-top: 2px;
  padding-top: 10px;
  border-top: 1px solid var(--sk-border);
}

.more-link {
  color: var(--sk-accent);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

.status[hidden],
.results[hidden],
.footer[hidden] {
  display: none;
}

.status {
  margin: 0;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--sk-surface);
  color: var(--sk-muted);
}

.status[data-kind='error'] {
  color: var(--sk-error);
  background: color-mix(in srgb, var(--sk-error) 12%, var(--sk-bg));
}

.status[data-kind='loading'] {
  color: var(--sk-muted);
}

.footer {
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--sk-border);
  font-size: 12px;
  color: var(--sk-muted);
}

.footer a {
  color: var(--sk-accent);
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
`.trim()

export function buildStyles(fontFace: string): string {
  return [fontFace, PLATE_STYLES, SHELL_STYLES].filter(Boolean).join('\n\n')
}
