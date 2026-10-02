#!/usr/bin/env node
// tokens/figma-variables.json  →  src/tokens/tokens.css (CSS custom properties, one block per mode)
//                               →  src/tokens/tokens.json (metadata for the Storybook token docs)
//                               →  src/tokens/tokens.ts   (typed var() references for components)
//
// Mode mapping: a collection with several modes gets a data attribute named after it.
//   Collection "Theme", modes Light/Dark  →  :root, [data-theme="light"] { … }  [data-theme="dark"] { … }
// Aliases stay aliases (var(--other-token)), so modes cascade exactly like they do in Figma.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalize, serialize } from './lib/normalize.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const SOURCE = resolve(ROOT, 'tokens/figma-variables.json')
const OUT_DIR = resolve(ROOT, 'src/tokens')

const PX_SCOPES = new Set(['WIDTH_HEIGHT', 'GAP', 'CORNER_RADIUS', 'STROKE_FLOAT', 'FONT_SIZE', 'LINE_HEIGHT', 'LETTER_SPACING', 'PARAGRAPH_SPACING', 'PARAGRAPH_INDENT', 'EFFECT_FLOAT'])
const UNITLESS_NAME = /(weight|opacity|z-?index|ratio|scale|duration|count|columns|order)/i

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
    case 'STRING': return `"${String(value).replace(/"/g, '\\"')}"`
    case 'BOOLEAN': return value ? '1' : '0'
    default: return String(value)
  }
}

export function buildTokens({ source = SOURCE, outDir = OUT_DIR, log = console.log } = {}) {
  const { meta } = normalize(JSON.parse(readFileSync(source, 'utf8')))
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
    if (value?.type === 'VARIABLE_ALIAS') {
      const target = byId.get(value.id)
      return target ? resolveLiteral(target, modeName, depth + 1) : null
    }
    return value === undefined ? null : formatRaw(value, v)
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
  writeFileSync(resolve(outDir, 'tokens.css'), css)
  writeFileSync(resolve(outDir, 'tokens.json'), serialize({ collections: docsCollections, tokens: docsTokens }))
  writeFileSync(resolve(outDir, 'tokens.ts'), ts)
  // Re-write the source in canonical form (no-op when already canonical).
  writeFileSync(source, serialize({ meta }))

  for (const w of warnings) log(`⚠︎ ${w}`)
  log(`✓ tokens: ${docsTokens.length} variables · ${docsCollections.length} collections → src/tokens/`)
  return { count: docsTokens.length, warnings }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { warnings } = buildTokens()
  if (process.argv.includes('--strict') && warnings.length) process.exit(1)
}
