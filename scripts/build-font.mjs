import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const venvPython = join(root, '.venv-font/bin/python')
const source = join(root, 'fonts/Kenteken-Smits-2013.otf')
const out = join(root, 'fonts/kenteken.woff2')
const dist = join(root, 'dist/kenteken.woff2')

if (!existsSync(source)) {
  console.warn('skip font build: fonts/Kenteken-Smits-2013.otf missing')
  process.exit(0)
}

if (!existsSync(venvPython)) {
  spawnSync('python3', ['-m', 'venv', join(root, '.venv-font')], { stdio: 'inherit' })
  spawnSync(join(root, '.venv-font/bin/pip'), ['install', '-q', 'fontTools', 'brotli'], {
    stdio: 'inherit',
  })
}

const py = `
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

font = TTFont(${JSON.stringify(source)})
opts = Options()
opts.flavor = "woff2"
opts.layout_features = ["*"]
subsetter = Subsetter(options=opts)
subsetter.populate(text="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789- ")
subsetter.subset(font)
font.save(${JSON.stringify(out)})
`

const result = spawnSync(venvPython, ['-c', py], { stdio: 'inherit' })
if (result.status !== 0) process.exit(result.status ?? 1)

mkdirSync(join(root, 'dist'), { recursive: true })
copyFileSync(out, dist)
console.log('built', out)
