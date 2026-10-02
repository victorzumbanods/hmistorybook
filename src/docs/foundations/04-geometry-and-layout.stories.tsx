import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Callout, DocPage, Note, Section, Table, cssVar, resolved } from './Doc'
import './04-geometry-and-layout.css'

// Content: [HMI] Foundations › "Geometry and layout" (Figma 6:6579), verbatim.
// Previews and gap examples bind to the Figma variables through cssVar(); the Figma binding's own value is the fallback.

const meta = { title: 'Foundations/Geometry and layout', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

/** `var(--token, fallback)` for a Figma variable, so the specimen follows the variable after every sync. */
const bound = (name: string, fallback: string) => cssVar(name).replace(/\)$/, `, ${fallback})`)
/** Tooltip showing the variable and its currently resolved value. */
const live = (name: string) => `${name} · ${resolved(name) || '—'}`

const Id = ({ first, id, mono = true, strong = false }: { first: ReactNode; id: string; mono?: boolean; strong?: boolean }) => (
  <div className="hmi-c4__id">
    <span className={strong ? 'hmi-c4__short' : mono ? 'hmi-c4__token' : undefined}>{first}</span>
    <span>{id}</span>
  </div>
)
const Value = ({ children }: { children: ReactNode }) => <span className="hmi-c4__value">{children}</span>

const RADIUS = [
  { sys: 'border/radius/none', sysId: 'VariableID:2:276', global: 'border/radius/0', globalId: 'VariableID:2:80', value: '0' },
  { sys: 'border/radius/xs', sysId: 'VariableID:2:272', global: 'border/radius/4', globalId: 'VariableID:2:82', value: '4' },
  { sys: 'border/radius/sm', sysId: 'VariableID:2:271', global: 'border/radius/6', globalId: 'VariableID:2:83', value: '6' },
  { sys: 'border/radius/md', sysId: 'VariableID:2:267', global: 'border/radius/8', globalId: 'VariableID:2:84', value: '8' },
  { sys: 'border/radius/lg', sysId: 'VariableID:2:265', global: 'border/radius/12', globalId: 'VariableID:2:85', value: '12' },
  { sys: 'border/radius/full', sysId: 'VariableID:2:277', global: 'border/radius/9999', globalId: 'VariableID:2:86', value: '9999' },
]

const BORDER = [
  { short: 'none', sysId: 'VariableID:2:268', globalId: 'VariableID:2:81', value: '0' },
  { short: 'sm', sysId: 'VariableID:2:266', globalId: 'VariableID:2:87', value: '1' },
  { short: 'md', sysId: 'VariableID:2:275', globalId: 'VariableID:2:88', value: '2' },
  { short: 'lg', sysId: 'VariableID:2:274', globalId: 'VariableID:2:89', value: '3' },
  { short: 'xl', sysId: 'VariableID:2:273', globalId: 'VariableID:2:90', value: '4' },
]

const SPACING = ['0', '2', '4', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '64', '80', '96', '128']
const SPACING_SCOPE = 'GAP, PARAGRAPH_SPACING, PARAGRAPH_INDENT'

const GAPS = ['6', '16', '32']

const GEOMETRY_COLUMNS = ['Sys: Semantic', 'Global source', 'Value', 'Bound preview']
const GEOMETRY_WIDTHS = ['30%', '30%', '10.5%', '29.5%']

function GapExample({ step }: { step: string }) {
  const name = `spacing/${step}`
  return (
    <>
      <div className="hmi-c4__gap-row" style={{ gap: bound(name, `${step}px`) }} title={live(name)}>
        <span />
        <span />
        <span />
      </div>
      <p className="hmi-c4__caption">
        spacing/{step} · {step} gap
      </p>
    </>
  )
}

function Page() {
  return (
    <DocPage
      chapter={4}
      context="Token strategy / Chapter 04 / Edition 02"
      title="Geometry and layout"
      summary="Numeric primitives keep geometry consistent. Semantic labels make the same choices easier to read in everyday design work."
    >
      <Section
        context="Current state"
        title="Radius: value to intent"
        explanation="Six semantic aliases resolve to Global numeric values. The previews bind corner radius to the actual Sys variables."
      >
        <div className="hmi-c4__scroll hmi-c4__geometry">
          <Table
            columns={GEOMETRY_COLUMNS}
            widths={GEOMETRY_WIDTHS}
            rows={RADIUS.map((r) => [
              <Id first={r.sys} id={r.sysId} />,
              <Id first={r.global} id={r.globalId} />,
              <Value>{r.value}</Value>,
              <div className="hmi-c4__preview">
                <div
                  className="hmi-c4__radius-box"
                  style={{ borderRadius: bound(r.sys, `${r.value}px`) }}
                  title={live(r.sys)}
                  aria-label={`${r.sys} preview`}
                />
              </div>,
            ])}
          />
        </div>
        <Note>
          All six radius mappings are valid. The full value is 9999, which produces a capsule or circle when constrained by the shape. Size labels describe
          context, not accessibility guarantees.
        </Note>
      </Section>

      <Section
        context="Current state"
        title="Border width: one shared scale"
        explanation="Five semantic aliases resolve to the current numeric border width primitives. Previews bind stroke width to the actual Sys variables."
      >
        <div className="hmi-c4__scroll hmi-c4__geometry">
          <Table
            columns={GEOMETRY_COLUMNS}
            widths={GEOMETRY_WIDTHS}
            rows={BORDER.map((b) => {
              const name = `border/width/${b.short}`
              return [
                <Id first={b.short} id={b.sysId} strong />,
                <Id first={b.value} id={b.globalId} mono={false} />,
                <Value>{b.value}</Value>,
                <div className="hmi-c4__preview">
                  <div
                    className="hmi-c4__border-box"
                    style={{ borderWidth: bound(name, `${b.value}px`) }}
                    title={live(name)}
                    aria-label={`${name} preview`}
                  />
                </div>,
              ]
            })}
          />
        </div>
        <Callout title="11 of 11 geometry aliases are connected">
          Use the semantic label when selecting an approved role. Inspect the primitive when explaining or changing the numeric source. A thicker border does
          not automatically create an accessible indicator; contrast and context still matter.
        </Callout>
      </Section>

      <Section
        context="Current state"
        title="Keep the uncategorized entries visible"
        explanation="Two breakpoint entries exist, but their names, values, and scopes do not form a usable responsive scale."
      >
        <div className="hmi-c4__scroll hmi-c4__ref">
          <Table
            columns={['Exact current token', 'Observed metadata', 'Recommended validation']}
            widths={['36.6%', '28.9%', '34.5%']}
            rows={[
              [
                <>breakpoint/LCD 🔴/0<div>VariableID:2:94</div></>,
                <>FLOAT · 0<div>Scope: STROKE_FLOAT</div></>,
                'Confirm intended device meaning, value, naming, and scope.',
              ],
              [
                <>breakpoint/LED 🔴/0<div>VariableID:2:101</div></>,
                <>FLOAT · 0<div>Scope: STROKE_FLOAT</div></>,
                'Determine whether this belongs in the future layout taxonomy.',
              ],
            ]}
          />
        </div>
        <Note>
          Retain these entries in the reference inventory until their purpose is resolved. Do not treat zero as a production breakpoint or assume that variable
          metadata implements responsive behavior.
        </Note>
      </Section>

      <Section
        context="Current state"
        title="Spacing is now a current scale"
        explanation="Global now includes 17 actual FLOAT spacing primitives. These primitives are hidden from publishing and currently have empty descriptions. They support GAP, PARAGRAPH_SPACING, and PARAGRAPH_INDENT scopes."
      >
        <div className="hmi-c4__panel">
          <p className="hmi-doc__context">Current spacing reference · sorted by numeric value</p>
          <p className="hmi-c4__panel-text">
            These primitives are actual variables. They are currently hidden from publishing and lack descriptions. Use the exact Global identifiers when
            inspecting or changing values. Recommended role aliases can be added later for repeated layout meaning.
          </p>
          <div className="hmi-c4__scroll hmi-c4__spacing">
            <Table
              columns={['Global token', 'Value', 'Supported scope']}
              widths={['44.4%', '13.6%', '42%']}
              rows={SPACING.map((s) => [`spacing/${s}`, s, SPACING_SCOPE])}
            />
          </div>
          <p className="hmi-c4__panel-text">
            Bound gap examples · spacing/6, spacing/16, and spacing/32. These demonstrate values, not approved usage roles.
          </p>
          {GAPS.map((g) => (
            <GapExample key={g} step={g} />
          ))}
        </div>

        <div className="hmi-c4__compare">
          <div className="hmi-c4__panel">
            <p className="hmi-doc__context">Auto Layout consumption</p>
            <h3 className="hmi-c4__panel-title">Bind decisions to the right axis</h3>
            <p className="hmi-c4__panel-text">
              Use the current spacing primitives for reviewed gap decisions. Their scopes are GAP, PARAGRAPH_SPACING, and PARAGRAPH_INDENT. Validate padding
              support before claiming it. Give text a wrapping width and a hugging height; use fill only when the parent supplies a clear size.
            </p>
          </div>
          <div className="hmi-c4__panel">
            <p className="hmi-doc__context">Density is an independent decision</p>
            <h3 className="hmi-c4__panel-title">Plan compact and comfortable together</h3>
            <p className="hmi-c4__panel-text">
              Evaluate padding, gaps, control dimensions, and touch targets as a coordinated density axis. Do not derive density or accessibility from a radius
              label.
            </p>
          </div>
        </div>

        <Callout title="Responsive behavior still needs design and implementation">
          Define layout rules, minimum sizes, wrapping, and viewport changes explicitly. Breakpoint tokens can communicate thresholds, but they do not make Figma
          frames or production layouts responsive automatically.
        </Callout>
      </Section>
    </DocPage>
  )
}

export const GeometryAndLayout: StoryObj = { name: 'Geometry and layout', render: () => <Page /> }
