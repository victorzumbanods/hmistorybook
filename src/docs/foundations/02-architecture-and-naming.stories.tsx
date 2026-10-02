import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Callout, DocPage, Note, Panel, Section, Table, cssVar, token } from './Doc'
import './02-architecture-and-naming.css'

// Content: [HMI] Foundations › "Architecture and naming" (Figma 6:6041), verbatim.

const meta = { title: 'Foundations/Architecture and naming', tags: ['doc-page'], parameters: { layout: 'fullscreen', controls: { disable: true }, actions: { disable: true }, interactions: { disable: true } } } satisfies Meta
export default meta

/** Live CSS variable for a Figma variable, falling back to the value shown in the Figma snapshot until it is synced. */
const live = (name: string, fallback: string) => (token(name) ? cssVar(name) : cssVar(name).replace(/\)$/, `, ${fallback})`))

const GOLD = live('color/identity/whirlpool-gold', '#eeb111')

/** Stacked lines inside one table cell (Figma line breaks). */
const Lines = ({ items, mono }: { items: string[]; mono?: boolean }) => (
  <div className="hmi-c2__lines">
    {items.map((l, i) => (
      <span key={i}>{mono ? <code>{l}</code> : l}</span>
    ))}
  </div>
)

const STEPS: { title: string; body: string }[] = [
  {
    title: '01 — Establish shared primitives in Global',
    body: 'Global supplies neutral colors, universal constants, numeric geometry, spacing, and typography scales.',
  },
  {
    title: '02 — Capture brand inputs in Ref: Whirlpool',
    body: 'Ref separates brand palettes from the Helvetica Neue family and five named font style strings.',
  },
  {
    title: '03 — Map selected roles in Sys: Semantic',
    body: 'Sys connects 11 geometry and four color roles to Global. Its 24 typography aliases add size and case references to Global and family and style references to Ref.',
  },
  {
    title: '04 — Leave additional color roles as direct values',
    body: 'The remaining 61 Sys colors are raw values. Their role names imply intended distinctions that still need validation.',
  },
]

function Node({ eyebrow, name, children }: { eyebrow: string; name: string; children: ReactNode }) {
  return (
    <div className="hmi-c2__node">
      <span className="hmi-c2__node-eyebrow">{eyebrow}</span>
      <span className="hmi-c2__node-name">{name}</span>
      <div className="hmi-c2__node-body">{children}</div>
    </div>
  )
}

const PREVIEWS: { name: string; value: string; caption: string }[] = [
  { name: 'color/background/surface/neutral/default', value: '#262626', caption: 'Neutral default' },
  { name: 'color/background/surface/brand/default', value: '#171717', caption: 'Brand default' },
  { name: 'color/background/surface/neutral/offset', value: '#525252', caption: 'Neutral offset' },
  { name: 'color/background/surface/brand/offset', value: '#262626', caption: 'Brand offset' },
]

function Page() {
  return (
    <DocPage
      chapter={2}
      context="Token strategy / Chapter 02"
      title="Architecture and naming"
      summary="A name carries intent. An alias carries a relationship. Document both so the architecture stays understandable as it grows."
    >
      <Section
        context="Interpretation"
        title="What the structure suggests"
        explanation="This is a reconstruction of the graph, not a verified history of how the system was built."
      >
        <ol className="hmi-c2__steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="hmi-c2__step">
              <span className="hmi-c2__marker" aria-hidden="true">{i + 1}</span>
              <div className="hmi-c2__step-body">
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        context="Current state"
        title="The actual dependency graph"
        explanation="Arrows represent current top level aliases. Nested neutral alpha references are a different kind of relationship."
      >
        <Panel label="Current connections">
          <div className="hmi-c2__graph" role="group" aria-label="Alias graph: Sys: Semantic to Global, 27 aliases; Sys: Semantic to Ref: Whirlpool, 12 typography aliases">
            <Node eyebrow="112 entries" name="Sys: Semantic">
              <p>39 direct aliases</p>
              <p>11 geometry · 4 color · 24 typography</p>
              <p>73 raw values</p>
            </Node>
            <div className="hmi-c2__connection">
              <span className="hmi-c2__arrow" style={{ color: GOLD }} aria-hidden="true">→</span>
              <span className="hmi-c2__connection-caption">27 aliases</span>
            </div>
            <Node eyebrow="89 entries" name="Global">
              <p>27 Sys aliases resolve here: geometry, surface colors, font sizes, and text transforms.</p>
            </Node>
            <Node eyebrow="49 entries" name="Ref: Whirlpool">
              <p>← 12 Sys typography aliases</p>
              <p>Six font families and six named styles resolve here.</p>
            </Node>
          </div>
          <p>
            Typography now connects Sys to Ref: Whirlpool. Color does not: all four semantic color aliases still point to Global neutrals. A brand role name
            is not evidence of a gold mapping.
          </p>
        </Panel>

        <div className="hmi-c2__proposed">
          <p className="hmi-doc__context">Proposed architecture · not present today</p>
          <div className="hmi-c2__proposed-row">
            <div className="hmi-c2__proposed-item">
              <span className="hmi-c2__proposed-title">Component meaning</span>
              <p className="hmi-c2__proposed-body">Only for repeated component specific needs.</p>
            </div>
            <span className="hmi-c2__proposed-arrow" aria-hidden="true">→</span>
            <div className="hmi-c2__proposed-item">
              <span className="hmi-c2__proposed-title">Approved semantic role</span>
              <p className="hmi-c2__proposed-body">Reuse the shared contract before adding new meaning.</p>
            </div>
          </div>
          <p className="hmi-c2__proposed-foot">
            This layer does not exist today. Add it only when the same component contract appears often enough to need its own vocabulary.
          </p>
        </div>
      </Section>

      <Section
        context="Current state"
        title="Follow a value to its source"
        explanation="These are current mappings. The token names and IDs are preserved so each relationship can be checked."
      >
        <Table
          columns={['Sys: Semantic source', 'Alias target and collection', 'Resolved value']}
          widths={['40%', '40%', '20%']}
          rows={[
            [<Lines mono items={['border/radius/md', 'VariableID:2:267']} />, <Lines items={['border/radius/8', 'VariableID:2:84']} />, '8'],
            [
              <Lines key="c1" mono items={['color/background/surface/neutral/default', 'VariableID:2:278']} />,
              <Lines key="c2" items={['color/neutral/800', 'VariableID:3:9']} />,
              '#262626',
            ],
            [
              <Lines key="c3" mono items={['color/background/surface/brand/default', 'VariableID:2:279']} />,
              <Lines key="c4" items={['color/neutral/900', 'VariableID:3:10']} />,
              '#171717',
            ],
            [
              <Lines key="c5" mono items={['color/background/surface/neutral/offset', 'VariableID:2:280']} />,
              <Lines key="c6" items={['color/neutral/600', 'VariableID:3:7']} />,
              '#525252',
            ],
            [
              <Lines key="c7" mono items={['color/background/surface/brand/offset', 'VariableID:2:281']} />,
              <Lines key="c8" items={['color/neutral/800', 'VariableID:3:9']} />,
              '#262626',
            ],
            [
              <Lines key="c9" mono items={['typography/display/font-family', 'VariableID:2:377']} />,
              <Lines key="c10" items={['Ref: Whirlpool', 'typography/font-family/helvetica-neue', 'VariableID:2:118']} />,
              'Helvetica Neue',
            ],
            [
              <Lines key="c11" mono items={['typography/display/font-weight', 'VariableID:2:378']} />,
              <Lines key="c12" items={['Ref: Whirlpool', 'typography/font-weight/Medium', 'VariableID:2:425']} />,
              'Medium',
            ],
            [
              <Lines key="a" mono items={['typography/meta/font-size', 'VariableID:2:641']} />,
              <Lines key="b" items={['Global typography/font-size/14', 'VariableID:2:506']} />,
              '16, not 14',
            ],
          ]}
        />
        <div className="hmi-c2__previews">
          {PREVIEWS.map((p) => (
            <div key={p.name} className="hmi-c2__preview" title={p.name}>
              <div className="hmi-c2__preview-fill" style={{ background: live(p.name, p.value) }} />
              <span>{p.caption}</span>
            </div>
          ))}
        </div>
        <Note>Bound previews above resolve from the four actual Sys surface variables. Brand/default currently means neutral/900, not Whirlpool gold.</Note>
      </Section>

      <Section
        context="Current state + recommendation"
        title="Names are a readable taxonomy"
        explanation="Use slash hierarchy to reveal category, purpose, and context without encoding a copied value in a role name."
      >
        <Table
          columns={['Layer', 'Exact current example', 'What the name communicates']}
          rows={[
            ['Primitive', 'color/neutral/800', 'A palette family and position in a source ramp.'],
            ['Reference', 'color/brand/gold/250', 'A brand palette entry rather than a UI role.'],
            ['Semantic', 'color/background/fill/brand/prominent', 'Where it acts, which role it serves, and its emphasis.'],
            [
              'Geometry',
              'border/radius/md',
              'A readable size label. Typography also uses role/property paths, while spacing uses numeric source labels.',
            ],
          ]}
        />
        <div className="hmi-c2__light-panel">
          <p className="hmi-doc__context">Current semantic color grammar</p>
          <p className="hmi-c2__grammar">color / background / category / role / detail</p>
          <p>
            Color categories are surface, fill, border, and content. Role coverage varies by family. Typography follows typography/role/property across
            display, headline, title, label, meta, and body. Spacing follows spacing/value. Names are a guide, not proof of the stored value.
          </p>
          <p>Content tokens also live beneath background today. This is the observed taxonomy, not a recommendation to silently rename them.</p>
        </div>
        <Callout title="Recommended future convention">
          Document emphasis separately from state: prominent, medium, subtle, and faint describe intensity; active, ghost, and disabled describe behavior. A
          proposed future grammar could explicitly distinguish category / role / emphasis / level from category / role / state / value. Validate
          coexistence rules, approve a migration, and preserve existing bindings until replacements are ready. This is not a change to the current five
          segment taxonomy.
        </Callout>
      </Section>
    </DocPage>
  )
}

export const ArchitectureAndNaming: StoryObj = { name: 'Architecture and naming', render: () => <Page /> }
