import data from '../tokens/tokens.json'

interface Token {
  name: string
  cssVar: string
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  collection: string
  values: Record<string, { css: string | null; alias: string | null; resolved: string | null }>
}
const tokens = data as unknown as { collections: { name: string; modes: { name: string; slug: string }[] }[]; tokens: Token[] }

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 }
const cell = { padding: '8px 12px', borderBottom: '1px solid var(--color-border-default)', verticalAlign: 'middle' } as const

function Preview({ token }: { token: Token }) {
  const v = `var(${token.cssVar})`
  if (token.type === 'COLOR')
    return <div style={{ width: 48, height: 32, borderRadius: 6, background: v, border: '1px solid var(--color-border-default)' }} />
  if (token.type === 'FLOAT' && /radius/i.test(token.name))
    return <div style={{ width: 40, height: 40, borderRadius: v, background: 'var(--color-action-primary-default)' }} />
  if (token.type === 'FLOAT' && /font\/size|font-size/i.test(token.name)) return <span style={{ fontSize: v, lineHeight: 1 }}>Aa</span>
  if (token.type === 'FLOAT' && /weight/i.test(token.name)) return <span style={{ fontWeight: v, fontSize: 20 }}>Aa</span>
  if (token.type === 'FLOAT') return <div style={{ width: `min(${v}, 240px)`, height: 12, borderRadius: 2, background: 'var(--color-action-primary-default)' }} />
  if (token.type === 'STRING' && /family/i.test(token.name)) return <span style={{ fontFamily: v, fontSize: 20 }}>Aa</span>
  return null
}

/** Live view of every Figma variable. Swatches use the CSS variable, so the toolbar modes apply. */
export function TokenGallery({ filter }: { filter?: RegExp }) {
  const list = tokens.tokens.filter((t) => !filter || filter.test(t.name))
  const byCollection = Map.groupBy(list, (t) => t.collection)
  return (
    <div style={{ padding: 24, display: 'grid', gap: 32 }}>
      {[...byCollection].map(([collection, items]) => {
        const modes = tokens.collections.find((c) => c.name === collection)!.modes
        return (
          <section key={collection}>
            <h2 style={{ margin: '0 0 12px', fontSize: 'var(--font-size-lg)' }}>{collection} <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>· {items.length}</span></h2>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                  <th style={cell}>Preview</th><th style={cell}>Figma variable</th><th style={cell}>CSS</th>
                  {modes.map((m) => <th key={m.slug} style={cell}>{m.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.cssVar}>
                    <td style={cell}><Preview token={t} /></td>
                    <td style={cell}>{t.name}</td>
                    <td style={{ ...cell, ...mono }}>{t.cssVar}</td>
                    {modes.map((m) => {
                      const val = t.values[m.name]
                      return (
                        <td key={m.slug} style={{ ...cell, ...mono }}>
                          {val?.resolved}
                          {val?.alias && <div style={{ color: 'var(--color-text-secondary)' }}>→ {val.alias}</div>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )
      })}
    </div>
  )
}
