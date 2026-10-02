import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import data from '../tokens/tokens.json'
import './gallery.css'

/* Live view of every Figma variable, grouped by collection and family.
   Previews render the CSS variables themselves, so they always match src/tokens/tokens.css. */

interface Token {
  name: string
  cssVar: string
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  collection: string
  scopes: string[]
  description: string
  values: Record<string, { css: string | null; alias: string | null; resolved: string | null }>
}
interface Collection { name: string; modes: { name: string; slug: string }[] }

const { tokens: TOKENS, collections: COLLECTIONS } = data as unknown as { tokens: Token[]; collections: Collection[] }
const TYPES = [
  { key: 'COLOR', label: 'Colors' },
  { key: 'FLOAT', label: 'Numbers' },
  { key: 'STRING', label: 'Strings' },
] as const

// ---------- helpers

const v = (t: Token) => `var(${t.cssVar})`
const first = (t: Token) => Object.values(t.values)[0]
const num = (t: Token) => parseFloat(first(t)?.resolved ?? '') || 0
const byName = (a: Token, b: Token) => a.name.localeCompare(b.name, 'en', { numeric: true })
const parentOf = (name: string) => name.split('/').slice(0, -1).join('/') || name
const leafOf = (name: string) => name.split('/').pop() ?? name
const titleOf = (path: string) => {
  const parts = path.split('/')
  const rest = parts.length > 1 ? parts.slice(1) : parts
  return rest.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')
}

/** "#f5f5f5" → "#F5F5F5"; "rgb(245 245 245 / 0.12)" → "#F5F5F5 · 12%" */
function prettyColor(value: string | null) {
  if (!value) return '—'
  const m = value.match(/^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/)
  if (!m) return value.toUpperCase()
  const hex = '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('').toUpperCase()
  return `${hex} · ${Math.round(Number(m[4]) * 100)}%`
}
const prettyValue = (t: Token) => {
  const r = first(t)?.resolved ?? '—'
  if (t.type === 'COLOR') return prettyColor(r)
  return r.replace(/^"(.*)"$/, '$1')
}

const has = (t: Token, scope: string) => t.scopes.includes(scope)
type Kind = 'radius' | 'stroke' | 'fontsize' | 'lineheight' | 'letter' | 'weight' | 'bar' | 'family' | 'style' | 'transform' | 'plain'
function kindOf(t: Token): Kind {
  const n = t.name.toLowerCase()
  if (t.type === 'STRING') {
    if (/text-transform|text-case/.test(n)) return 'transform'
    if (has(t, 'FONT_FAMILY') || /font-family/.test(n)) return 'family'
    if (has(t, 'FONT_STYLE') || /font-weight|font-style/.test(n)) return 'style'
    return 'plain'
  }
  if (has(t, 'CORNER_RADIUS') || /radius/.test(n)) return 'radius'
  if (/border\/width|stroke/.test(n)) return 'stroke'
  if (has(t, 'FONT_SIZE') || /font-size/.test(n)) return 'fontsize'
  if (has(t, 'LINE_HEIGHT') || /line-height/.test(n)) return 'lineheight'
  if (has(t, 'LETTER_SPACING') || /letter-spacing/.test(n)) return 'letter'
  if (has(t, 'FONT_WEIGHT') || /weight/.test(n)) return 'weight'
  if (has(t, 'GAP') || has(t, 'WIDTH_HEIGHT') || /spacing|size|gap|width|height|breakpoint/.test(n)) return 'bar'
  return 'plain'
}
const STYLE_WEIGHTS: Record<string, number> = { thin: 100, extralight: 200, light: 300, regular: 400, book: 400, medium: 500, semibold: 600, bold: 700, black: 900 }
const familyVar = TOKENS.find((t) => kindOf(t) === 'family')

function Preview({ t }: { t: Token }) {
  const kind = kindOf(t)
  const value = v(t)
  switch (kind) {
    case 'radius': return <div className="hmi-gal__radius" style={{ borderTopLeftRadius: `min(${value}, 48px)` }} />
    case 'stroke': return num(t) === 0 ? <span className="hmi-gal__num">none</span> : <div className="hmi-gal__stroke" style={{ borderWidth: value }} />
    case 'bar': return num(t) === 0 ? <span className="hmi-gal__num">0</span> : <div className="hmi-gal__bar" style={{ width: value }} />
    case 'fontsize': return <span className="hmi-gal__type" style={{ fontSize: `min(${value}, 56px)` }}>Aa</span>
    case 'weight': return <span className="hmi-gal__type" style={{ fontWeight: value, fontSize: 24 }}>Aa</span>
    case 'letter': return <span className="hmi-gal__type" style={{ letterSpacing: value }}>Letter spacing</span>
    case 'lineheight':
      return num(t) === 0 ? <span className="hmi-gal__num">0</span> : (
        <div className="hmi-gal__lines" style={{ '--lh': value } as CSSProperties}>Line one<br />Line two</div>
      )
    case 'family': return <span className="hmi-gal__type" style={{ fontFamily: `${value}, system-ui`, fontSize: 24 }}>Aa Bb Cc 123</span>
    case 'style': {
      const w = STYLE_WEIGHTS[prettyValue(t).toLowerCase().replace(/\s/g, '')] ?? 400
      return <span className="hmi-gal__type" style={{ fontWeight: w, fontSize: 24, fontFamily: familyVar ? `${v(familyVar)}, system-ui` : undefined }}>Aa {prettyValue(t)}</span>
    }
    case 'transform': return <span className="hmi-gal__type" style={{ textTransform: value as CSSProperties['textTransform'] }}>Start cycle</span>
    default: return <span className="hmi-gal__num">{prettyValue(t)}</span>
  }
}

function Meta({ t }: { t: Token }) {
  const alias = first(t)?.alias
  return (
    <div className="hmi-gal__row-meta">
      <span className="hmi-gal__cssvar">{t.cssVar}</span>
      {alias && <span className="hmi-gal__alias">{alias}</span>}
      {t.description && <span className="hmi-gal__desc" title={t.description}>{t.description}</span>}
    </div>
  )
}

function ColorCard({ t, onCopy }: { t: Token; onCopy: (t: Token) => void }) {
  const modes = Object.entries(t.values)
  const alias = first(t)?.alias
  return (
    <button type="button" className="hmi-gal__color" onClick={() => onCopy(t)} title={`${t.name}\nClick to copy ${v(t)}`}>
      <div className="hmi-gal__color-chip">
        {modes.length > 1 ? (
          <div className="hmi-gal__modes" style={{ position: 'absolute', inset: 0 }}>
            {modes.map(([m, val]) => <span key={m} title={m} style={{ background: val.resolved ?? undefined }} />)}
          </div>
        ) : (
          <span style={{ background: v(t) }} />
        )}
      </div>
      <div className="hmi-gal__color-body">
        <span className="hmi-gal__color-name">{leafOf(t.name)}</span>
        <span className="hmi-gal__color-value">{prettyValue(t)}</span>
        {alias && <span className="hmi-gal__alias">{alias}</span>}
      </div>
    </button>
  )
}

function Group({ path, items, onCopy }: { path: string; items: Token[]; onCopy: (t: Token) => void }) {
  const colors = items.filter((t) => t.type === 'COLOR')
  const others = items.filter((t) => t.type !== 'COLOR')
  const numeric = others.length > 0 && others.every((t) => t.type === 'FLOAT')
  const rows = numeric ? [...others].sort((a, b) => num(a) - num(b) || byName(a, b)) : others
  return (
    <div className="hmi-gal__group">
      <div className="hmi-gal__group-head">
        <h3>{titleOf(path)}</h3>
        <span className="hmi-gal__group-path">{path}/</span>
        <span className="hmi-gal__group-count">{items.length} variable{items.length === 1 ? '' : 's'}</span>
      </div>
      <div>
        {colors.length > 0 && (
          <div className="hmi-gal__colors">{colors.map((t) => <ColorCard key={t.cssVar} t={t} onCopy={onCopy} />)}</div>
        )}
        {rows.length > 0 && (
          <div className="hmi-gal__rows" style={colors.length ? { marginTop: 20 } : undefined}>
            {rows.map((t) => (
              <button type="button" key={t.cssVar} className="hmi-gal__row" onClick={() => onCopy(t)} title={`Click to copy ${v(t)}`}>
                <span className="hmi-gal__row-name">{leafOf(t.name)}</span>
                <span className="hmi-gal__row-visual"><Preview t={t} /></span>
                <span className="hmi-gal__row-value">{prettyValue(t)}</span>
                <Meta t={t} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button type="button" className="hmi-gal__pill" aria-pressed={active} onClick={onClick}>{children}</button>
}

export function TokenGallery() {
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(null), 1600)
    return () => clearTimeout(id)
  }, [copied])

  const onCopy = (t: Token) => {
    navigator.clipboard?.writeText(v(t)).catch(() => {})
    setCopied(v(t))
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TOKENS.filter(
      (t) =>
        (!collection || t.collection === collection) &&
        (!type || t.type === type) &&
        (!q || t.name.toLowerCase().includes(q) || t.cssVar.includes(q) || prettyValue(t).toLowerCase().includes(q)),
    )
  }, [query, collection, type])

  const sections = COLLECTIONS.map((c) => {
    const list = filtered.filter((t) => t.collection === c.name).sort(byName)
    const groups = new Map<string, Token[]>()
    for (const t of list) {
      const key = parentOf(t.name)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(t)
    }
    return { c, list, groups: [...groups] }
  }).filter((s) => s.list.length)

  const countIn = (name: string) => TOKENS.filter((t) => t.collection === name).length
  const countType = (k: string) => TOKENS.filter((t) => t.type === k).length

  return (
    <main className="hmi-gal">
      <div className="hmi-gal__wrap">
        <header className="hmi-gal__header">
          <p className="hmi-gal__context">Foundations / Variables</p>
          <h1 className="hmi-gal__title">Figma Variables</h1>
          <p className="hmi-gal__summary">
            Every variable from [HMI] Foundations, as generated into <code>tokens.css</code>. Previews use the CSS variables themselves, so this page always
            shows the latest sync. Click any variable to copy its <code>var()</code>.
          </p>
          <div className="hmi-gal__overview">
            <div className="hmi-gal__ov"><b>{TOKENS.length}</b>Variables</div>
            {COLLECTIONS.map((c) => (
              <div key={c.name} className="hmi-gal__ov"><b>{countIn(c.name)}</b>{c.name} · {c.modes.length} mode{c.modes.length === 1 ? '' : 's'}</div>
            ))}
          </div>
        </header>

        <div className="hmi-gal__toolbar">
          <input className="hmi-gal__search" type="search" placeholder="Search name, CSS variable or value" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search variables" />
          <div className="hmi-gal__pills" role="group" aria-label="Collection">
            <Pill active={!collection} onClick={() => setCollection(null)}>All</Pill>
            {COLLECTIONS.map((c) => (
              <Pill key={c.name} active={collection === c.name} onClick={() => setCollection(c.name)}>{c.name}<small>{countIn(c.name)}</small></Pill>
            ))}
          </div>
          <span className="hmi-gal__divider" />
          <div className="hmi-gal__pills" role="group" aria-label="Type">
            {TYPES.map((tp) => (
              <Pill key={tp.key} active={type === tp.key} onClick={() => setType(type === tp.key ? null : tp.key)}>{tp.label}<small>{countType(tp.key)}</small></Pill>
            ))}
          </div>
        </div>

        {sections.length === 0 && <p className="hmi-gal__empty">No variables match “{query}”.</p>}

        {sections.map(({ c, list, groups }) => (
          <section key={c.name} className="hmi-gal__collection">
            <div className="hmi-gal__col-head">
              <h2>{c.name}</h2>
              <div className="hmi-gal__col-meta">
                <span className="hmi-gal__tag">{list.length} variables</span>
                <span className="hmi-gal__tag">{groups.length} groups</span>
                <span className="hmi-gal__tag">Modes: {c.modes.map((m) => m.name).join(', ')}</span>
              </div>
            </div>
            {groups.map(([path, items]) => <Group key={path} path={path} items={items} onCopy={onCopy} />)}
          </section>
        ))}
      </div>
      {copied && <div className="hmi-gal__toast" role="status">Copied <code>{copied}</code></div>}
    </main>
  )
}
