// Canonical shape for tokens/figma-variables.json.
// Both entry points produce this exact output so Git diffs only show real variable changes:
//   - scripts/figma-pull.mjs  (Figma REST API, Enterprise)
//   - figma-plugin/code.js    (Figma Plugin API, any plan) — keep its copy of this logic in sync.

const COLLECTION_FIELDS = ['id', 'name', 'key', 'modes', 'defaultModeId', 'variableIds', 'remote', 'hiddenFromPublishing']
const VARIABLE_FIELDS = ['id', 'name', 'key', 'variableCollectionId', 'resolvedType', 'valuesByMode', 'scopes', 'codeSyntax', 'description', 'remote', 'hiddenFromPublishing']

const round = (n, places) => Math.round(n * 10 ** places) / 10 ** places

function normalizeValue(value, type) {
  if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') return { type: 'VARIABLE_ALIAS', id: value.id }
  if (type === 'COLOR') return { r: round(value.r, 6), g: round(value.g, 6), b: round(value.b, 6), a: round(value.a ?? 1, 6) }
  if (type === 'FLOAT') return round(value, 4)
  return value
}

function pick(obj, fields) {
  const out = {}
  for (const f of fields) if (obj[f] !== undefined) out[f] = obj[f]
  return out
}

/** Accepts a raw REST response ({ meta }), a bare meta object, or an already-normalized file. */
export function normalize(input) {
  const meta = input.meta ?? input
  const collections = Object.values(meta.variableCollections ?? {})
  const variables = Object.values(meta.variables ?? {})
  const colName = new Map(collections.map((c) => [c.id, c.name]))

  const outCollections = {}
  for (const c of [...collections].sort((a, b) => a.name.localeCompare(b.name))) {
    outCollections[c.id] = pick({ ...c, modes: c.modes.map((m) => ({ modeId: m.modeId, name: m.name })) }, COLLECTION_FIELDS)
  }

  const outVariables = {}
  const sorted = [...variables].sort(
    (a, b) => (colName.get(a.variableCollectionId) ?? '').localeCompare(colName.get(b.variableCollectionId) ?? '') || a.name.localeCompare(b.name),
  )
  for (const v of sorted) {
    const valuesByMode = {}
    for (const modeId of Object.keys(v.valuesByMode).sort()) valuesByMode[modeId] = normalizeValue(v.valuesByMode[modeId], v.resolvedType)
    outVariables[v.id] = pick({ ...v, valuesByMode, scopes: [...(v.scopes ?? [])].sort(), codeSyntax: v.codeSyntax ?? {}, description: v.description ?? '' }, VARIABLE_FIELDS)
  }

  return { meta: { variableCollections: outCollections, variables: outVariables } }
}

export const serialize = (data) => JSON.stringify(data, null, 2) + '\n'
