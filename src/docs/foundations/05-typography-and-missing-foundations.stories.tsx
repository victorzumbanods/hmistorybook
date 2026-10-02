import type { Meta, StoryObj } from '@storybook/react-vite'
import { Callout, DocPage, Mono, Note, Section, Sub, Table } from './Doc'
import './05-typography-and-missing-foundations.css'

// Content: [HMI] Foundations › "Typography and missing foundations" (Figma 6:6817), verbatim.

const meta = { title: 'Foundations/Typography and missing foundations', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

const id = (name: string, variableId: string) => (
  <>
    <code>{name}</code>
    <Sub>
      <code>{variableId}</code>
    </Sub>
  </>
)
const stored = (type: string, value: string) => (
  <>
    {type}
    <Sub>{value}</Sub>
  </>
)

const WEIGHT_NOTE = 'New style string; validate supported weights and naming.'
const CASE_NOTE = 'Validate scope mapping and Figma text case application.'

const REFERENCE_ROWS = [
  [id('typography/font-family/helvetica-neue', 'VariableID:2:118'), stored('STRING', 'Helvetica Neue'), 'Availability, licensing, and supported named styles are not confirmed.'],
  [id('typography/font-weight/Thin', 'VariableID:2:422'), stored('STRING', 'Thin'), WEIGHT_NOTE],
  [id('typography/font-weight/Light', 'VariableID:2:423'), stored('STRING', 'Light'), WEIGHT_NOTE],
  [id('typography/font-weight/Regular', 'VariableID:2:424'), stored('STRING', 'Regular'), WEIGHT_NOTE],
  [id('typography/font-weight/Medium', 'VariableID:2:425'), stored('STRING', 'Medium'), WEIGHT_NOTE],
  [id('typography/font-weight/Bold', 'VariableID:2:426'), stored('STRING', 'Bold'), WEIGHT_NOTE],
  ...(
    [
      ['12', '2:490', '12'],
      ['16', '2:491', '16'],
      ['20', '2:492', '20'],
      ['24', '2:493', '24'],
      ['32', '2:494', '32'],
      ['40', '2:495', '40'],
      ['48', '2:496', '48'],
      ['64', '2:497', '64'],
      ['80', '2:498', '80'],
      ['14', '2:506', '16'],
      ['18', '2:507', '16'],
      ['28', '2:508', '24'],
      ['36', '2:509', '32'],
      ['56', '2:510', '48'],
    ] as const
  ).map(([suffix, vid, value]) => [
    id(`typography/font-size/${suffix}`, `VariableID:${vid}`),
    `FLOAT · ${value}`,
    suffix === value ? 'Primitive value matches suffix.' : `Suffix mismatch: ${suffix} → ${value}.`,
  ]),
  [id('typography/text-transform/none', 'VariableID:2:615'), stored('STRING', 'none'), CASE_NOTE],
  [id('typography/text-transform/uppercase', 'VariableID:2:616'), stored('STRING', 'uppercase'), CASE_NOTE],
]

const ROLE_ROWS = (
  [
    ['Display', 'Medium', '64', '/64'],
    ['Headline', 'Medium', '48', '/48'],
    ['Title', 'Medium', '32', '/32'],
    ['Label', 'Regular', '16', '/16'],
    ['Meta', 'Regular', '16', '/14'],
    ['Body', 'Regular', '24', '/24'],
  ] as const
).map(([role, style, size, source]) => [
  <>
    {role}
    <Sub>Helvetica Neue · {style}</Sub>
  </>,
  <>
    {size}
    <Sub>Source {source}</Sub>
  </>,
  <>
    Line height 0 · tracking 0<Sub>Case → uppercase</Sub>
  </>,
])

const STEPS = [
  {
    n: '01',
    title: 'Validate the family and named styles',
    body: 'Confirm font availability, licensing, supported weights, and design to engineering naming. Record fallback behavior for environments without the custom family.',
  },
  {
    n: '02',
    title: 'Define a scale from real content',
    body: 'Review the existing size labels and actual values. Map each role to an approved line height, define tracking units, and review uppercase usage for body copy. Test long copy, localization, and narrow layouts.',
  },
  {
    n: '03',
    title: 'Map complete roles to local text styles',
    body: 'Create local styles that combine the validated family, named style, size, line height, and letter spacing. Connect reusable variables where supported.',
  },
  {
    n: '04',
    title: 'Document usage and validate outcomes',
    body: 'Show when each role applies, what it should not replace, and how it behaves in narrow layouts. Check legibility, contrast, and implementation parity.',
  },
]

function Page() {
  return (
    <DocPage
      chapter={5}
      context="Token strategy / Chapter 05"
      title="Typography and missing foundations"
      summary="Brand inputs are the starting point. A usable typography system also needs validated font styles, a scale, and clear reading roles."
    >
      <Section
        context="Current state"
        title="The new typography foundation"
        explanation="80 typography variables now exist: 38 in Global, six raw reference strings in Ref, and 36 property variables across six Sys roles. The foundation is present, but the contract still needs validation."
      >
        <div className="hmi-c5__summary">
          <strong>Snapshot summary</strong>
          <p>
            Global supplies 14 font sizes, 22 line heights, and two text transforms. Ref holds the family and five named style strings. Sys defines six
            roles with six properties each.
          </p>
          <p>
            The raw family string is now Helvetica Neue, scoped to FONT_FAMILY. Availability, licensing, supported named styles, and fallback behavior are
            not confirmed.
          </p>
          <p>The former numeric weight variables are absent. Five new string weight styles are stored: Thin, Light, Regular, Medium, and Bold.</p>
          <p>
            All 14 font size primitives are hidden from publishing. Five numeric names differ from their stored values. The 22 line height primitives are
            also hidden and have no Sys aliases.
          </p>
          <p>
            The none and uppercase strings use FONT_STYLE scope. Validate how they map to text case in Figma and exports; their presence alone does not
            apply a transformation.
          </p>
        </div>
        <Table columns={['Exact current identifier', 'Type and stored value', 'Validation notes']} widths={['42%', '22%', '36%']} rows={REFERENCE_ROWS} />
        <Callout title="Inventory replacement does not prove consumer migration or direct numerical equivalence">
          The new string weight styles and global primitives are a foundation, but they do not confirm supported named styles, licensing, or fallback
          behavior. Review each alias against the available font family before creating local text styles.
        </Callout>
        <Note>
          Removed: numeric FLOAT weights /400, /500, and /700, IDs VariableID:2:119, VariableID:2:120, and VariableID:2:121. Added: five named STRING
          weights with new IDs. This is not an in place type change. The retained family token changed from HelveticaNeueforWHPWeb to Helvetica Neue.
          Consumer migration was not audited.
        </Note>
      </Section>

      <Section
        context="Current state"
        title="Six roles, actual values"
        explanation="Each role has family, style, size, line height, tracking, and case. 24 properties are aliases; 12 store raw zero values. None has a description, and all use ALL_SCOPES."
      >
        <Table columns={['Role, family, and style', 'Resolved size', 'Line height, tracking, and case']} rows={ROLE_ROWS} />
        <Note>
          Zero line height is not proven to mean Auto. Define units and approved line height mappings before binding or rendering. Tracking zero may be
          intentional, but its units still need a contract. All six roles, including body, point to uppercase; review readability rather than silently
          changing it. Meta resolves to 16 because the source named /14 stores 16.
        </Note>
        <Mono>
          Example chain: typography/display/font-family (VariableID:2:377) → Ref typography/font-family/helvetica-neue (VariableID:2:118) → Helvetica Neue.
          Display style points to Medium (VariableID:2:425). Meta size (VariableID:2:641) → Global typography/font-size/14 (VariableID:2:506) → 16.
        </Mono>
      </Section>

      <Section
        context="Illustration"
        title="A readable illustration, not a brand preview"
        explanation="This treatment uses Inter to show hierarchy only. It does not depict Helvetica Neue or a current tokenized type scale. Brand previews should remain illustrative until the family is confirmed available."
      >
        <div className="hmi-c5__specimen">
          <p className="hmi-c5__specimen-eyebrow">Illustrative documentation treatment · Inter</p>
          <p className="hmi-c5__specimen-title">Make the next decision clearer.</p>
          <p className="hmi-c5__specimen-body">
            A useful type system supports how people read: scanning a title, understanding an explanation, and checking a precise value. Its roles should
            serve those moments consistently.
          </p>
          <div className="hmi-c5__specimen-meta">
            <span>Title 40px / Body 17px / Metadata 12px</span>
            <span>Illustration only</span>
          </div>
        </div>
      </Section>

      <Section
        context="Recommended next step"
        title="Build the contract in order"
        explanation="Start with what actually renders, then define roles people can select without guessing. The new foundation is present, but it is still incomplete and needs validation."
      >
        <ol className="hmi-c5__steps">
          {STEPS.map((s) => (
            <li key={s.n} className="hmi-c5__step">
              <span className="hmi-c5__step-marker" aria-hidden="true">
                {s.n}
              </span>
              <div className="hmi-c5__step-text">
                <h3 className="hmi-c5__step-title">{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        context="Current state + recommendation"
        title="Missing foundations, in context"
        explanation="Add a foundation when repeated needs demonstrate its value, not to make the inventory look larger."
      >
        <Table
          columns={['Foundation', 'Exists now', 'Not defined', 'Add when']}
          widths={['18%', '27%', '27%', '28%']}
          rows={[
            [
              'Typography',
              '38 Global primitives, six Ref strings, and six Sys roles with 36 properties.',
              'Local text styles, reviewed line height mappings, explicit units, and validated case behavior.',
              'Repeated reading roles have validated font mappings and reviewed usage guidance.',
            ],
            ['Spacing and dimensions', '17 spacing tokens exist.', 'Semantic spacing or dimension scale.', 'Common layout decisions recur across products.'],
            ['Elevation', 'No local effect styles.', 'Shadow and elevation roles.', 'Layer hierarchy needs consistent depth.'],
            ['Motion', 'No motion foundation.', 'Duration, easing, and motion roles.', 'Repeated transitions need shared behavior and reduced motion guidance.'],
            [
              'Component tokens',
              'No component token layer.',
              'Component specific aliases.',
              'Repeated component meaning cannot be expressed cleanly with shared semantic roles.',
            ],
            ['Theme and brand modes', 'One mode in every collection.', 'Multiple theme or brand modes.', 'Full role mapping and a validated mode matrix are ready.'],
          ]}
        />
        <Callout title="Concrete use guidance">
          Use reviewed geometry and color roles. Spacing and typography now exist, but their presence is not approval of every use. Confirm actual values,
          scopes, line heights, font availability, and case choices before adopting the new foundations.
        </Callout>
      </Section>
    </DocPage>
  )
}

export const TypographyAndMissingFoundations: StoryObj = { name: 'Typography and missing foundations', render: () => <Page /> }
