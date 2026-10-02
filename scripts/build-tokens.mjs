#!/usr/bin/env node
// tokens/figma-variables.json  →  src/tokens/tokens.css (CSS custom properties, one block per mode)
//                               →  src/tokens/tokens.json (metadata for the Storybook token docs)
//                               →  src/tokens/tokens.ts   (typed var() references for components)
//
// Mode mapping: a collection with several modes gets a data attribute named after it.
//   Collection "Theme", modes Light/Dark  →  :root, [data-theme="light"] { … }  [data-theme="dark"] { … }
// Aliases stay aliases (var(--other-token)), so modes cascade exactly like they do in Figma.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize, serialize } from './lib/normalize.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const SOURCE = resolve(ROOT, 'tokens/figma-variables.json')
const OUT_DIR = resolve(ROOT, 'src/tokens')

const PX_SCOPES = new Set(['WIDTH_HEIGHT', 'GAP', 'CORNER_RADIUS', 'STROKE_FLOAT', 'FONT_SIZE', 'LINE_HEIGHT', 'LETTER_SPACING', 'PARAGRAPH_SPACING', 'PARAGRAPH_INDENT', 'EFFECT_FLOAT'])
const CSS_KEYWORDS = new Set(['uppercase', 'lowercase', 'capitalize', 'none', 'full-width'])
const UNITLESS_NAME = /(weight|opacity|z-?index|ratio|scale|duration|count|columns|order)/i

// Skip identical writes: rewriting a watched file would retrigger the Storybook watcher forever.
function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false
  writeFileSync(file, content)
  return true
}

export const slugify = (s) =>
  s.trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function cssVarName(v) {
  const web = v.codeSyntax?.WEB?.trim()
  if (web) {
    const m = web.match(/--[\w-]+/)
    if (m) return m[0]
  }
  return `--${slugify(v.name.replace(/\//g, '-'))}`
}

const hex2 = (n) => Math.round(n * 255).toString(16).padStart(2, '0')
function formatColor({ r, g, b, a }) {
  if (a >= 1) return `#${hex2(r)}${hex2(g)}${hex2(b)}`
  const c = (n) => Math.round(n * 255)
  return `rgb(${c(r)} ${c(g)} ${c(b)} / ${Math.round(a * 1000) / 1000})`
}

function formatFloat(n, v) {
  const scopes = v.scopes ?? []
  if (scopes.includes('OPACITY')) return String(n > 1 ? n / 100 : n)
  if (scopes.includes('FONT_WEIGHT')) return String(n)
  if (scopes.some((s) => PX_SCOPES.has(s))) return n === 0 ? '0' : `${n}px`
  if (UNITLESS_NAME.test(v.name)) return String(n)
  return n === 0 ? '0' : `${n}px`
}

function formatRaw(value, v) {
  switch (v.resolvedType) {
    case 'COLOR': return formatColor(value)
    case 'FLOAT': return formatFloat(value, v)
    case 'STRING':
      // CSS keywords (text-transform values) must stay unquoted; everything else is a quoted string.
      if (/text-(transform|case)/i.test(v.name) || CSS_KEYWORDS.has(String(value))) return String(value)
      return `"${String(value).replace(/"/g, '\\"')}"`
    case 'BOOLEAN': return value ? '1' : '0'
    default: return String(value)
  }
}

export function buildTokens({ source = SOURCE, outDir = OUT_DIR, log = console.log } = {}) {
  const raw = readFileSync(source, 'utf8')
  const { meta } = normalize(JSON.parse(raw))
  const collections = Object.values(meta.variableCollections)
  const variables = Object.values(meta.variables)
  const byId = new Map(variables.map((v) => [v.id, v]))
  const colById = new Map(collections.map((c) => [c.id, c]))
  const warnings = []

  // Detect CSS name collisions (e.g. same variable name in two collections).
  const seen = new Map()
  for (const v of variables) {
    const name = cssVarName(v)
    if (seen.has(name)) warnings.push(`CSS name collision: ${name} ("${seen.get(name)}" and "${v.name}") — the later one wins.`)
    seen.set(name, v.name)
  }

  const valueFor = (v, modeId) => {
    const value = v.valuesByMode[modeId]
    if (value === undefined) return null
    if (value && typeof value === 'object' && 'opacity' in value && 'color' in value) {
      // Alias (or color) with opacity → color-mix keeps the link to the source token.
      const inner = value.color
      const target = inner?.type === 'VARIABLE_ALIAS' ? byId.get(inner.id) : null
      if (inner?.type === 'VARIABLE_ALIAS' && !target) {
        warnings.push(`"${v.name}" aliases a variable that is not in the export (${inner.id}).`)
        return null
      }
      const base = target ? `var(${cssVarName(target)})` : formatColor(inner)
      return { css: `color-mix(in srgb, ${base} ${value.opacity}%, transparent)`, alias: target ? `${target.name} @ ${value.opacity}%` : null }
    }
    if (value?.type === 'VARIABLE_ALIAS') {
      const target = byId.get(value.id)
      if (!target) {
        warnings.push(`"${v.name}" aliases a variable that is not in the export (${value.id}). Publish/export the source library too.`)
        return null
      }
      return { css: `var(${cssVarName(target)})`, alias: target.name }
    }
    return { css: formatRaw(value, v) }
  }

  // Resolve aliases to a literal for docs display. Mode is matched by name across collections, falling back to default.
  const resolveLiteral = (v, modeName, depth = 0) => {
    if (depth > 20) return null
    const col = colById.get(v.variableCollectionId)
    if (!col) return null
    const mode = col.modes.find((m) => m.name === modeName) ?? col.modes.find((m) => m.modeId === col.defaultModeId)
    const value = v.valuesByMode[mode.modeId]
    if (value && typeof value === 'object' && 'opacity' in value && 'color' in value) {
      const base = value.color?.type === 'VARIABLE_ALIAS' ? resolveColor(byId.get(value.color.id), modeName, depth + 1) : value.color
      return base ? formatColor({ ...base, a: (base.a ?? 1) * (value.opacity / 100) }) : null
    }
    if (value?.type === 'VARIABLE_ALIAS') {
      const target = byId.get(value.id)
      return target ? resolveLiteral(target, modeName, depth + 1) : null
    }
    return value === undefined ? null : formatRaw(value, v)
  }

  // Same walk as resolveLiteral, but returns the RGBA object (needed to apply opacity on top of an alias).
  const resolveColor = (v, modeName, depth = 0) => {
    if (!v || depth > 20) return null
    const col = colById.get(v.variableCollectionId)
    if (!col) return null
    const mode = col.modes.find((m) => m.name === modeName) ?? col.modes.find((m) => m.modeId === col.defaultModeId)
    const value = v.valuesByMode[mode.modeId]
    if (value && typeof value === 'object' && 'opacity' in value && 'color' in value) {
      const base = value.color?.type === 'VARIABLE_ALIAS' ? resolveColor(byId.get(value.color.id), modeName, depth + 1) : value.color
      return base ? { ...base, a: (base.a ?? 1) * (value.opacity / 100) } : null
    }
    if (value?.type === 'VARIABLE_ALIAS') return resolveColor(byId.get(value.id), modeName, depth + 1)
    return value && typeof value === 'object' && 'r' in value ? value : null
  }

  // ---- CSS
  let css = '/* AUTO-GENERATED from tokens/figma-variables.json by scripts/build-tokens.mjs — do not edit. */\n'
  const docsCollections = []
  for (const col of collections) {
    const vars = variables.filter((v) => v.variableCollectionId === col.id && !v.remote)
    if (!vars.length) continue
    const slug = slugify(col.name)
    const multiMode = col.modes.length > 1
    const attribute = multiMode ? `data-${slug}` : null
    docsCollections.push({
      name: col.name,
      slug,
      attribute,
      defaultMode: slugify(col.modes.find((m) => m.modeId === col.defaultModeId).name),
      modes: col.modes.map((m) => ({ name: m.name, slug: slugify(m.name) })),
    })
    const ordered = [...col.modes].sort((a, b) => (a.modeId === col.defaultModeId ? -1 : b.modeId === col.defaultModeId ? 1 : 0))
    for (const mode of ordered) {
      const isDefault = mode.modeId === col.defaultModeId
      const selector = !multiMode ? ':root' : isDefault ? `:root,\n[${attribute}="${slugify(mode.name)}"]` : `[${attribute}="${slugify(mode.name)}"]`
      css += `\n/* ${col.name}${multiMode ? ` · ${mode.name}` : ''} */\n${selector} {\n`
      for (const v of vars) {
        const val = valueFor(v, mode.modeId)
        if (val) css += `  ${cssVarName(v)}: ${val.css};\n`
      }
      css += '}\n'
    }
  }

  // Remote (library) variables referenced by aliases still need a value.
  const remote = variables.filter((v) => v.remote)
  if (remote.length) {
    css += '\n/* Remote library variables referenced by aliases */\n:root {\n'
    for (const v of remote) {
      const col = colById.get(v.variableCollectionId)
      const val = valueFor(v, col?.defaultModeId ?? Object.keys(v.valuesByMode)[0])
      if (val) css += `  ${cssVarName(v)}: ${val.css};\n`
    }
    css += '}\n'
  }

  // ---- Docs JSON
  const docsTokens = variables.filter((v) => !v.remote).map((v) => {
    const col = colById.get(v.variableCollectionId)
    const values = {}
    for (const m of col.modes) {
      const val = valueFor(v, m.modeId)
      values[m.name] = { css: val?.css ?? null, alias: val?.alias ?? null, resolved: resolveLiteral(v, m.name) }
    }
    return { name: v.name, cssVar: cssVarName(v), type: v.resolvedType, collection: col.name, scopes: v.scopes, description: v.description, values }
  })

  // ---- TS references (nested by Figma path; a path that is both leaf and group stores the leaf under DEFAULT)
  const tree = {}
  for (const t of docsTokens) {
    const parts = t.name.split('/').map((p) => p.trim()).filter(Boolean)
    let node = tree
    parts.forEach((p, i) => {
      const last = i === parts.length - 1
      if (last) {
        if (typeof node[p] === 'object') node[p].DEFAULT = `var(${t.cssVar})`
        else node[p] = `var(${t.cssVar})`
      } else {
        if (typeof node[p] === 'string') node[p] = { DEFAULT: node[p] }
        node[p] ??= {}
        node = node[p]
      }
    })
  }
  const modes = Object.fromEntries(docsCollections.filter((c) => c.attribute).map((c) => [c.slug, c.modes.map((m) => m.slug)]))
  const ts =
    '// AUTO-GENERATED from tokens/figma-variables.json by scripts/build-tokens.mjs — do not edit.\n\n' +
    `export const vars = ${JSON.stringify(tree, null, 2)} as const\n\n` +
    `export const modes = ${JSON.stringify(modes, null, 2)} as const\n\n` +
    `export type CssVar =\n${[...new Set(docsTokens.map((t) => t.cssVar))].map((n) => `  | '${n}'`).join('\n')}\n`

  mkdirSync(outDir, { recursive: true })
  writeIfChanged(resolve(outDir, 'tokens.css'), css)
  writeIfChanged(resolve(outDir, 'tokens.json'), serialize({ collections: docsCollections, tokens: docsTokens }))
  writeIfChanged(resolve(outDir, 'tokens.ts'), ts)
  // The source is never rewritten here: only the Figma plugin and scripts/figma-pull.mjs write it.
  if (serialize({ meta }) !== raw) log('⚠︎ tokens/figma-variables.json is not in canonical form (re-export it from Figma).')

  for (const w of warnings) log(`⚠︎ ${w}`)
  log(`✓ tokens: ${docsTokens.length} variables · ${docsCollections.length} collections → src/tokens/`)
  return { count: docsTokens.length, warnings }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { warnings } = buildTokens()
  if (process.argv.includes('--strict') && warnings.length) process.exit(1)
}
