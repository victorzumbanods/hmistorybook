// HMI Variables → GitHub — plugin sandbox.
// Exports local variables in the same canonical shape as scripts/lib/normalize.mjs (keep both in sync),
// then hands the JSON to ui.html, which commits it to GitHub.

figma.showUI(__html__, { width: 400, height: 560, themeColors: true })

const SETTINGS_KEY = 'hmi-github-settings'

// ---- canonical normalization (mirror of scripts/lib/normalize.mjs)
const COLLECTION_FIELDS = ['id', 'name', 'key', 'modes', 'defaultModeId', 'variableIds', 'remote', 'hiddenFromPublishing']
const VARIABLE_FIELDS = ['id', 'name', 'key', 'variableCollectionId', 'resolvedType', 'valuesByMode', 'scopes', 'codeSyntax', 'description', 'remote', 'hiddenFromPublishing']
const round = (n, places) => Math.round(n * Math.pow(10, places)) / Math.pow(10, places)
// Code-point order: identical in Node and in Figma's plugin sandbox (localeCompare is not).
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

function normalizeValue(value, type) {
  if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') return { type: 'VARIABLE_ALIAS', id: value.id }
  // Alias (or color) with opacity, e.g. { color: { type: 'VARIABLE_ALIAS', id }, opacity: 12 }
  if (value && typeof value === 'object' && 'color' in value && 'opacity' in value) return { color: normalizeValue(value.color, type), opacity: round(value.opacity, 4) }
  if (type === 'COLOR') return { r: round(value.r, 6), g: round(value.g, 6), b: round(value.b, 6), a: round(value.a === undefined ? 1 : value.a, 6) }
  if (type === 'FLOAT') return round(value, 4)
  return value
}

function pick(obj, fields) {
  const out = {}
  for (const f of fields) if (obj[f] !== undefined) out[f] = obj[f]
  return out
}

function normalize(collections, variables) {
  const colName = new Map(collections.map((c) => [c.id, c.name]))
  const outCollections = {}
  for (const c of collections.slice().sort((a, b) => cmp(a.name, b.name))) {
    outCollections[c.id] = pick(Object.assign({}, c, { modes: c.modes.map((m) => ({ modeId: m.modeId, name: m.name })) }), COLLECTION_FIELDS)
  }
  const outVariables = {}
  const sorted = variables.slice().sort(
    (a, b) => cmp(colName.get(a.variableCollectionId) || '', colName.get(b.variableCollectionId) || '') || cmp(a.name, b.name),
  )
  for (const v of sorted) {
    const valuesByMode = {}
    for (const modeId of Object.keys(v.valuesByMode).sort()) valuesByMode[modeId] = normalizeValue(v.valuesByMode[modeId], v.resolvedType)
    outVariables[v.id] = pick(
      Object.assign({}, v, { valuesByMode, scopes: (v.scopes || []).slice().sort(), codeSyntax: v.codeSyntax || {}, description: v.description || '' }),
      VARIABLE_FIELDS,
    )
  }
  return { meta: { variableCollections: outCollections, variables: outVariables } }
}

// Plugin API objects are proxies: copy fields explicitly.
const plainCollection = (c) => ({
  id: c.id, name: c.name, key: c.key, modes: c.modes, defaultModeId: c.defaultModeId,
  variableIds: c.variableIds.slice(), remote: c.remote, hiddenFromPublishing: c.hiddenFromPublishing,
})
const plainVariable = (v) => ({
  id: v.id, name: v.name, key: v.key, variableCollectionId: v.variableCollectionId, resolvedType: v.resolvedType,
  valuesByMode: JSON.parse(JSON.stringify(v.valuesByMode)), scopes: v.scopes.slice(), codeSyntax: Object.assign({}, v.codeSyntax),
  description: v.description, remote: v.remote, hiddenFromPublishing: v.hiddenFromPublishing,
})

async function exportVariables() {
  const collections = (await figma.variables.getLocalVariableCollectionsAsync()).map(plainCollection)
  const variables = (await figma.variables.getLocalVariablesAsync()).map(plainVariable)

  // Follow aliases into subscribed libraries so every var() reference resolves.
  const known = new Set(variables.map((v) => v.id))
  const knownCollections = new Set(collections.map((c) => c.id))
  const queue = []
  const enqueueAliases = (v) => {
    for (let val of Object.values(v.valuesByMode)) {
      if (val && val.color) val = val.color
      if (val && val.type === 'VARIABLE_ALIAS' && !known.has(val.id)) queue.push(val.id)
    }
  }
  variables.forEach(enqueueAliases)
  while (queue.length) {
    const id = queue.shift()
    if (known.has(id)) continue
    known.add(id)
    const remote = await figma.variables.getVariableByIdAsync(id)
    if (!remote) continue
    const pv = plainVariable(remote)
    pv.remote = true
    variables.push(pv)
    enqueueAliases(pv)
    if (!knownCollections.has(pv.variableCollectionId)) {
      knownCollections.add(pv.variableCollectionId)
      const col = await figma.variables.getVariableCollectionByIdAsync(pv.variableCollectionId)
      if (col) collections.push(Object.assign(plainCollection(col), { remote: true }))
    }
  }

  return {
    json: JSON.stringify(normalize(collections, variables), null, 2) + '\n',
    stats: { variables: variables.filter((v) => !v.remote).length, remote: variables.filter((v) => v.remote).length, collections: collections.filter((c) => !c.remote).length },
    fileName: figma.root.name,
    user: figma.currentUser ? figma.currentUser.name : 'Figma',
  }
}

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === 'init') {
      figma.ui.postMessage({ type: 'settings', settings: (await figma.clientStorage.getAsync(SETTINGS_KEY)) || {} })
    } else if (msg.type === 'save-settings') {
      await figma.clientStorage.setAsync(SETTINGS_KEY, msg.settings)
    } else if (msg.type === 'export') {
      figma.ui.postMessage(Object.assign({ type: 'exported' }, await exportVariables()))
    } else if (msg.type === 'notify') {
      figma.notify(msg.text, { error: !!msg.error })
    } else if (msg.type === 'close') {
      figma.closePlugin()
    }
  } catch (err) {
    figma.ui.postMessage({ type: 'error', message: String(err && err.message ? err.message : err) })
  }
}
