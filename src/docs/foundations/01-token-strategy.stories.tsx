import type { Meta, StoryObj } from '@storybook/react-vite'
import { Callout, DocPage, Mono, Note, Panel, Section, Stats, Sub, Table } from './Doc'

// Content: [HMI] Foundations › ⚙️ Token Strategy › "Token strategy" (Figma 6:5894), verbatim.

const meta = { title: 'Foundations/Token strategy', tags: ['doc-page'], parameters: { layout: 'fullscreen', controls: { disable: true }, actions: { disable: true }, interactions: { disable: true } } } satisfies Meta
export default meta

function Page() {
  return (
    <DocPage
      chapter={1}
      context="Token strategy / Chapter 01"
      title="Token strategy"
      summary="Choose meaning, not copied values. A shared vocabulary makes design decisions easier to understand, reuse, and evolve."
    >
      <Section
        context="Current state"
        title="A system with layered intent"
        explanation="The system now includes spacing primitives and connected typography roles. The next step is to make those meanings as dependable as their values."
      >
        <Panel label="The strategy" statement="Keep the source simple. Give every role a reason. Let people choose with confidence.">
          <p>
            Global establishes shared values. Ref: Whirlpool captures brand references. Sys: Semantic names reusable roles. Typography now connects both
            source collections to Sys, while most semantic colors remain direct values.
          </p>
        </Panel>
        <Stats
          items={[
            { figure: '250', label: 'Local variables', detail: '129 COLOR · 95 FLOAT · 26 STRING' },
            { figure: '3', label: 'Collections', detail: 'Global · Ref: Whirlpool · Sys: Semantic' },
            { figure: '1', label: 'Mode per collection', detail: 'No confirmed theme or brand switching' },
            { figure: '18', label: 'Existing descriptions', detail: '18 of 250 · currently in Portuguese' },
          ]}
        />
      </Section>

      <Section
        context="Current state"
        title="Three distinct responsibilities"
        explanation="Collection names suggest a separation between shared values, brand references, and roles that consumers can understand. Global now includes spacing and typography foundations, Ref: Whirlpool now includes a named font family and named style weights, and Sys: Semantic now connects typography references between Ref and Sys."
      >
        <Table
          columns={['Collection and inventory', 'Observed contents', 'Mode and visibility']}
          rows={[
            [
              <>Global<Sub>89 variables · 21 COLOR · 66 FLOAT · 2 STRING</Sub></>,
              'Shared colors and geometry, 17 spacing primitives, 14 font sizes, 22 line heights, two text transforms, and two unresolved breakpoint entries.',
              <>Mode 1 · default 2:0<Sub>53 hidden · 36 not hidden</Sub></>,
            ],
            [
              <>Ref: Whirlpool<Sub>49 variables · 43 COLOR · 0 FLOAT · 6 STRING</Sub></>,
              '43 color references, the Helvetica Neue family, and five named font style strings: Thin, Light, Regular, Medium, and Bold.',
              <>Default · 2:1<Sub>44 hidden · 5 not hidden</Sub></>,
            ],
            [
              <>Sys: Semantic<Sub>112 variables · 65 COLOR · 29 FLOAT · 18 STRING</Sub></>,
              'Surface, fill, border, and content roles, plus radius, border width, and typography aliases.',
              <>Mode 1 · default 2:2<Sub>112 not hidden from publishing</Sub></>,
            ],
          ]}
        />
        <Mono>Collection IDs: Global VariableCollectionId:2:79; Ref: Whirlpool VariableCollectionId:2:107; Sys: Semantic VariableCollectionId:2:164.</Mono>
        <Callout title="Visibility is metadata, not evidence of a release">
          Hidden from publishing does not confirm an actual published library. No component adoption, production usage, ownership, release history, or
          historical implementation process was audited.
        </Callout>
      </Section>

      <Section
        context="Chapter index"
        title="Read the strategy"
        explanation="Each chapter stands alone. Together they connect the current inventory with a practical path to maintain it."
      >
        <Table
          columns={['Chapter', 'What you will understand', 'What you can do next']}
          rows={[
            ['01 · Token strategy', 'The system’s purpose, boundaries, and observed maturity.', 'Align on a shared definition of readiness.'],
            ['02 · Architecture and naming', 'The actual alias graph and current naming taxonomy.', 'Document meanings before expanding conventions.'],
            ['03 · Color and accessibility', 'Palette families, semantic coverage, and contrast evidence.', 'Validate roles and surface/content pairs.'],
            ['04 · Geometry and layout', 'Geometry aliases and the current 17 value spacing scale.', 'Validate gap usage, scopes, and breakpoint intent.'],
            ['05 · Typography and missing foundations', 'Six typography roles, their actual values, and validation gaps.', 'Review size labels, line heights, and text case before adoption.'],
            ['06 · Scaling the system and its documentation', 'Governance, token records, release checks, and migration.', 'Make every change traceable and reviewable.'],
          ]}
        />
      </Section>

      <Section
        context="Current vs recommended"
        title="Readiness, without assumptions"
        explanation="The inventory has grown by 93 variables. More coverage is useful, but readiness still depends on meaning, valid bindings, and reviewed outcomes."
      >
        <Table
          columns={['Current state', 'Interpretation', 'Recommended next step']}
          rows={[
            [
              '39 of 112 Sys variables are direct aliases: 11 geometry, 4 color, and 24 typography. The other 73 store raw values.',
              'Typography now connects Ref and Global to Sys. Color still has no aliases to Ref. Spacing exists only in Global.',
              'Validate color meanings, then alias approved roles to existing primitives.',
            ],
            [
              'Only 18 Global descriptions exist. The other 232 are empty.',
              'Knowledge is mostly in names and relationships rather than documented guidance.',
              'Record purpose, usage, exceptions, and review responsibility.',
            ],
            [
              'No local text, paint, or effect styles. One mode in every collection.',
              'The inventory is not a complete type, effect, or theme system.',
              'Validate the existing spacing and typography foundations before adding new layers or modes.',
            ],
          ]}
        />
        <Note>
          Evidence boundary: all current state statements reflect the local variable snapshot from October 2, 2026. Interpretation is labeled as “What the
          structure suggests.” Recommendations describe a future approach, not an existing commitment.
        </Note>
      </Section>
    </DocPage>
  )
}

export const TokenStrategy: StoryObj = { name: 'Token strategy', render: () => <Page /> }
