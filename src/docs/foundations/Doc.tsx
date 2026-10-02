import type { CSSProperties, ReactNode } from 'react'
import tokens from '../../tokens/tokens.json'
import './doc.css'

/* Building blocks for the Foundations documentation, mirroring the [HMI] Foundations Figma pages.
   Text content is copied verbatim from Figma; live specimens read src/tokens/tokens.json and render
   CSS variables, so they follow the Figma variables after every sync. */

export const CHAPTERS = [
  { n: '01', nav: 'Strategy', title: 'Token strategy', id: 'foundations-token-strategy--token-strategy' },
  { n: '02', nav: 'Architecture', title: 'Architecture and naming', id: 'foundations-architecture-and-naming--architecture-and-naming' },
  { n: '03', nav: 'Color', title: 'Color and accessibility', id: 'foundations-color-and-accessibility--color-and-accessibility' },
  { n: '04', nav: 'Geometry', title: 'Geometry and layout', id: 'foundations-geometry-and-layout--geometry-and-layout' },
  { n: '05', nav: 'Typography', title: 'Typography and missing foundations', id: 'foundations-typography-and-missing-foundations--typography-and-missing-foundations' },
  { n: '06', nav: 'Scaling', title: 'Scaling the system and its documentation', id: 'foundations-scaling-the-system-and-its-documentation--scaling-the-system-and-its-documentation' },
] as const

// ---------- tokens

export interface TokenDoc {
  name: string
  cssVar: string
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  collection: string
  description: string
  scopes: string[]
  values: Record<string, { css: string | null; alias: string | null; resolved: string | null }>
}
export const TOKENS = (tokens as unknown as { tokens: TokenDoc[] }).tokens
const byName = new Map(TOKENS.map((t) => [t.name, t]))

/** Token record by Figma variable name (e.g. "color/neutral/100"). */
export const token = (name: string) => byName.get(name)
/** `var(--…)` for a Figma variable name; falls back to the slug rule if the variable was renamed or removed. */
export const cssVar = (name: string) => `var(${byName.get(name)?.cssVar ?? '--' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')})`
/** First mode's resolved value (literal) for display. */
export const resolved = (name: string) => {
  const t = byName.get(name)
  return t ? Object.values(t.values)[0]?.resolved ?? '' : '—'
}
/** Variables whose name starts with a prefix, in token order. */
export const tokensUnder = (prefix: string) => TOKENS.filter((t) => t.name.startsWith(prefix))

// ---------- page chrome

export function DocPage({ chapter, context, title, summary, footer = 'Strategy documentation · Edition 02 · US English', children }: {
  chapter: number
  context: string
  title: string
  summary: ReactNode
  footer?: string
  children: ReactNode
}) {
  const current = CHAPTERS[chapter - 1]
  return (
    <article className="hmi-doc">
      <header className="hmi-doc__status">
        <span className="hmi-doc__identity">WHIRLPOOL / SYSTEM NOTES</span>
        <span className="hmi-doc__source">
          <span>Source snapshot · October 2, 2026 · Edition 02</span>
          <span className="hmi-doc__pill">Observed + proposed</span>
        </span>
      </header>
      <nav className="hmi-doc__nav" aria-label="Chapters">
        {CHAPTERS.map((c) => (
          <a key={c.n} href={`./?path=/story/${c.id}`} target="_top" aria-current={c.n === current.n ? 'page' : undefined}>
            {c.n} {c.nav}
          </a>
        ))}
      </nav>
      <div className="hmi-doc__heading">
        <div className="hmi-doc__heading-text">
          <p className="hmi-doc__context">{context}</p>
          <h1 className="hmi-doc__title">{title}</h1>
          <p className="hmi-doc__summary">{summary}</p>
        </div>
        <p className="hmi-doc__number" aria-hidden="true">{current.n}</p>
      </div>
      <div className="hmi-doc__content">{children}</div>
      <footer className="hmi-doc__footer">
        <span>{footer}</span>
        <span>{current.n} / 06</span>
      </footer>
    </article>
  )
}

export function Section({ context, title, explanation, children }: { context: string; title: string; explanation?: ReactNode; children?: ReactNode }) {
  return (
    <section className="hmi-doc__section">
      <div className="hmi-doc__intro">
        <p className="hmi-doc__context">{context}</p>
        <h2 className="hmi-doc__section-title">{title}</h2>
        {explanation && <p className="hmi-doc__explanation">{explanation}</p>}
      </div>
      <div className="hmi-doc__evidence">{children}</div>
    </section>
  )
}

// ---------- content blocks

/** Reference table. Cells accept text or nodes; use <Sub> for a muted second line. */
export function Table({ columns, rows, widths }: { columns: ReactNode[]; rows: ReactNode[][]; widths?: string[] }) {
  return (
    <table className="hmi-doc__table">
      {widths && <colgroup>{widths.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>}
      <thead>
        <tr>{columns.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}

export const Sub = ({ children }: { children: ReactNode }) => <div className="sub">{children}</div>
export const Mono = ({ children }: { children: ReactNode }) => <p className="hmi-doc__mono">{children}</p>
export const Note = ({ children }: { children: ReactNode }) => <p className="hmi-doc__note">{children}</p>

export function Callout({ title, children }: { title?: ReactNode; children?: ReactNode }) {
  return (
    <div className="hmi-doc__callout">
      {title && <strong>{title}</strong>}
      {children && <div>{children}</div>}
    </div>
  )
}

export function Panel({ label, statement, children }: { label: string; statement?: ReactNode; children?: ReactNode }) {
  return (
    <div className="hmi-doc__panel">
      <p className="hmi-doc__context">{label}</p>
      {statement && <p className="hmi-doc__panel-statement">{statement}</p>}
      {children}
    </div>
  )
}

export function Stats({ items, cols = items.length }: { items: { figure: ReactNode; label: ReactNode; detail?: ReactNode }[]; cols?: number }) {
  return (
    <div className="hmi-doc__stats" style={{ '--cols': cols } as CSSProperties}>
      {items.map((s, i) => (
        <div key={i} className="hmi-doc__stat">
          <span className="hmi-doc__stat-figure">{s.figure}</span>
          <span className="hmi-doc__stat-label">{s.label}</span>
          {s.detail && <span>{s.detail}</span>}
        </div>
      ))}
    </div>
  )
}

// ---------- live specimens (CSS variables → update with Figma)

/** Color chips for the given variable names (or every variable under a prefix). */
export function Swatches({ names, prefix, label = (n: string) => n.split('/').pop() }: { names?: string[]; prefix?: string; label?: (name: string) => ReactNode }) {
  const list = names ?? (prefix ? tokensUnder(prefix).map((t) => t.name) : [])
  return (
    <div className="hmi-doc__swatches">
      {list.map((n) => (
        <div key={n} className="hmi-doc__swatch" title={n}>
          <div className="hmi-doc__chip"><span style={{ background: cssVar(n) }} /></div>
          <span className="hmi-doc__swatch-name">{label(n)}</span>
          <span className="hmi-doc__swatch-value">{resolved(n)}</span>
        </div>
      ))}
    </div>
  )
}
