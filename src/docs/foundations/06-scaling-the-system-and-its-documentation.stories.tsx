import type { Meta, StoryObj } from '@storybook/react-vite'
import { Callout, DocPage, Mono, Note, Panel, Section, Stats, Table, cssVar } from './Doc'
import './06-scaling-the-system-and-its-documentation.css'

// Content: [HMI] Foundations › "Scaling the system and its documentation" (Figma 6:6971), verbatim.

const meta = { title: 'Foundations/Scaling the system and its documentation', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

/** Live radius bound to the Figma variable border/radius/md (falls back to its snapshot value, 8). */
const recordRadius = cssVar('border/radius/md').replace(/\)$/, ', 8px)')

const STEPS = [
  {
    n: '01',
    title: 'Make the current meanings explicit',
    body: 'Document role purpose and propose ownership. Validate neutral alpha serialization, the two breakpoint entries, repeated neutral role values, and the gold alpha RGB difference.',
  },
  {
    n: '02',
    title: 'Connect approved meanings to existing sources',
    body: 'Replace approved direct semantic values with aliases when an existing primitive is intended. Preserve current appearance unless a visible change is explicitly approved.',
  },
  {
    n: '03',
    title: 'Validate and complete existing foundations',
    body: 'Validate and complete existing foundations: review size suffix mismatch, meaning of zero line height, choose approved aliases from 22 existing line heights, review uppercase for body, validate units, scopes, and font availability. Keep those as review questions, not automatic corrections or claimed errors.',
  },
  {
    n: '04',
    title: 'Introduce modes only after full role mapping',
    body: 'Plan theme or brand modes after the complete role matrix is mapped and validated. Require mode parity and contrast evidence for every supported context.',
  },
  {
    n: '05',
    title: 'Add component aliases only for repeated meaning',
    body: 'Create a component layer when repeated component specific contracts need stable names. Avoid speculative token volume or unnecessary indirection.',
  },
]

function Page() {
  return (
    <DocPage
      chapter={6}
      context="Token strategy / Chapter 06 · Updated for new variables"
      title="Scaling the system and its documentation"
      summary="Scale decisions and documentation together. Every addition should have a reason, a reviewer, and a clear path from source to release."
    >
      <Section
        context="Recommended next step"
        title="A roadmap based on evidence"
        explanation="This is a recommended sequence, not an existing schedule or ownership model. Prioritize validating the new spacing and typography foundations."
      >
        <ol className="hmi-c6__steps">
          {STEPS.map((s) => (
            <li key={s.n} className="hmi-c6__step">
              <span className="hmi-c6__marker" aria-hidden="true">{s.n}</span>
              <div className="hmi-c6__step-body">
                <p className="hmi-c6__step-title">{s.title}</p>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        context="Current state"
        title="A concrete token record"
        explanation="This completed example preserves actual source data. Missing ownership and lifecycle information remain explicitly unrecorded. The variable itself remains unchanged: border/radius/md resolves to 8."
      >
        <div className="hmi-c6__panel">
          <p className="hmi-doc__context">Current token · source metadata + curated interpretation</p>
          <div className="hmi-c6__record">
            <div className="hmi-c6__record-id">
              <p className="hmi-c6__headline">border/radius/md</p>
              <Mono>VariableID:2:267 · Sys: Semantic</Mono>
            </div>
            <div className="hmi-c6__radius" style={{ borderRadius: recordRadius }} title="border/radius/md" role="img" aria-label="border/radius/md radius specimen" />
          </div>
        </div>
        <Table
          columns={['Record field', 'Recorded value or explicit boundary']}
          widths={['24.4%', '75.6%']}
          rows={[
            ['Name, ID, collection, type', 'border/radius/md · VariableID:2:267 · Sys: Semantic · FLOAT'],
            [
              'Role and rationale',
              'Medium radius, inferred from the name. The alias separates a readable role from the numeric Global source. Historical rationale is not recorded.',
            ],
            ['Raw value or alias target', 'Alias → Global border/radius/8 · VariableID:2:84'],
            ['Resolved value per mode', 'Mode 1 · mode ID 2:2 · resolves to 8. Alpha is not applicable to FLOAT.'],
            ['Scope', 'CORNER_RADIUS'],
            ['Status, owner, lifecycle', 'Not recorded. No approved status, assigned owner, or lifecycle stage is confirmed.'],
            ['Recommended owner', 'System designer with an engineering partner, proposed for review.'],
            [
              'Accessibility evidence',
              'A radius has no color contrast pair. Confirm target size, focus visibility, and related component behavior separately.',
            ],
            [
              'Usage example and exceptions',
              'Suggested use: an approved medium rounded boundary. Do not use the label as proof of target size or accessibility. Component exceptions are not recorded.',
            ],
            ['Replacement and release record', 'Not recorded. No replacement, deprecation window, or release history is confirmed.'],
          ]}
        />
        <Note>
          Use the same record contract for new tokens: name, collection, type, role, rationale, raw value or alias target, resolved value and alpha per
          mode, scope, status, recommended owner, accessibility pair evidence, usage example, exceptions, replacement, and release record. The inventory
          now includes 250 variables across Global, Ref, and Sys collections.
        </Note>
      </Section>

      <Section
        context="Recommended documentation architecture"
        title="Separate source from guidance"
        explanation="The raw variable metadata and alias graph are canonical. Human explanations add judgment and must remain reviewable."
      >
        <Table
          columns={['Documentation layer', 'Source and maintenance approach']}
          widths={['29.9%', '70.1%']}
          rows={[
            ['Strategy overview', 'Curated purpose, boundaries, maturity, and principles. Review when the system’s direction changes.'],
            ['Category chapters', 'One chapter per category with usage rules, bound examples, accessibility evidence, and known questions.'],
            [
              'Generated reference inventory',
              'Include every variable and every mode, IDs, types, scopes, values, alias targets, visibility, and descriptions. Retain uncategorized entries.',
            ],
            ['Guidance and decision log', 'Reviewed explanations, role definitions, tradeoffs, exceptions, and decisions with evidence.'],
            ['Release and migration notes', 'Versioned change diffs, impact, replacements, migration windows, and retirement records.'],
          ]}
        />
        <Callout title="Binding is not automatic documentation maintenance">
          Actual swatches and geometry previews bind to source variables. Prose, counts, labels, relationships, contrast evidence, and exported snapshots
          do not update automatically. Regenerate reference data and perform editorial review with every release. Future typography specimens should
          bind to safe source properties only after validation, and zero line height must not create 0px specimens.
        </Callout>
        <Note>
          Recommended future portability: agree on a token schema and export pipeline that preserve IDs, names, types, mode values, aliases, scopes, and
          composite alpha. No portable schema or current export pipeline is confirmed. Validate round trip behavior before treating exported artifacts as
          dependable. The current update is a documentation refresh, not proof of published library or production adoption.
        </Note>
      </Section>

      <Section
        context="Recommended governance"
        title="Review before publication"
        explanation="A proposed system designer and engineering partner should review changes together. Bring in product reviewers when usage is affected."
      >
        <Table
          columns={['Review gate', 'Evidence to attach']}
          rows={[
            [
              'Source integrity',
              'Version stamp, source snapshot date, generated inventory, exact semantic names and IDs, change diff, and observed delta summary.',
            ],
            [
              'Alias health',
              'Confirm valid dependencies, no unresolved references or cycles, and intended resolution in every supported mode. Review removed IDs and changed types before migrating consumers.',
            ],
            [
              'Type, scope, and mode parity',
              'Correct types and scopes; complete values and relationships in every supported mode. Today each collection has one mode.',
            ],
            [
              'Descriptions and meaning',
              'Missing descriptions report, approved role definitions, usage examples, exceptions, and documented decisions.',
            ],
            [
              'Visual and accessibility validation',
              'Contrast pairs per mode, actual alpha compositing, behavior beyond color, and impact review for visible changes.',
            ],
            [
              'Consumer and lifecycle checks',
              'Orphan and deprecation checks, affected usage audit, replacement plan, and product reviewer input.',
            ],
            [
              'Documentation publication',
              'Regenerated references, reviewed prose and examples, accurate counts and labels, versioned release notes, and observed delta summary.',
            ],
          ]}
        />
        <div className="hmi-c6__pair">
          <div className="hmi-c6__panel">
            <p className="hmi-doc__context">Proposed reviewers</p>
            <p>System designer: meaning, naming, guidance, and visual consistency.</p>
            <p>Engineering partner: export fidelity, alias behavior, scope, and consumer impact.</p>
            <p>Product reviewers: affected usage, exceptions, and migration readiness.</p>
          </div>
          <div className="hmi-c6__panel">
            <p className="hmi-doc__context">Release checklist</p>
            <p>
              Confirm source and documentation agree. Resolve review questions or record an explicit decision. Attach accessibility evidence. Approve
              impact and migration. Regenerate the reference. Publish the version and release notes. This checklist remains proposed, not currently
              established.
            </p>
          </div>
        </div>
        <Note>Ownership and this review process are proposed, not currently established.</Note>
      </Section>

      <Section
        context="Recommended policy"
        title="Version the meaning, not just the file"
        explanation="Compatibility depends on what consumers can safely expect. A visually small change can still have a large impact. The recent type and name changes require a consumer usage audit before migration."
      >
        <Table
          columns={['Recommended release level', 'Use when']}
          widths={['29.9%', '70.1%']}
          rows={[
            ['Minor', 'Adding compatible tokens without changing existing consumer expectations.'],
            [
              'Major',
              'Renaming or removing tokens incompatibly, or changing their meaning. This includes type and name changes that affect consumer expectations.',
            ],
            [
              'Patch',
              'Making validated corrections only when consumers are unaffected. Any visible value change still requires impact review. Type and name changes are compatibility sensitive and should not be treated as patches.',
            ],
          ]}
        />
        <div className="hmi-c6__panel">
          <p className="hmi-doc__context">Recommended migration path</p>
          <p className="hmi-c6__headline">Retain → record → migrate → verify → retire</p>
          <p className="hmi-c6__body">
            Keep the old token during an announced migration window. Record its replacement and communicate the reason. Migrate bindings, confirm no
            remaining usage, then retire it with release notes. Define the window with affected teams rather than inventing a fixed timeline.
          </p>
        </div>
      </Section>

      <Section
        context="Current baseline + next actions"
        title="Measure what is known"
        explanation="Use current coverage as a baseline. Adoption and production usage require a future audit. The inventory increased from 157 to 250 variables, with 96 added and 3 removed for a net change of 93."
      >
        <Stats
          items={[
            { figure: '39/112', label: 'Sys alias coverage', detail: '39 direct aliases / 112 Sys variables' },
            { figure: '4/65', label: 'Semantic color aliases', detail: '4 surface color aliases / 65 semantic color variables' },
            { figure: '18/250', label: 'Description coverage', detail: '18 descriptions / 250 variables, 232 empty' },
            { figure: '1 each', label: 'Mode coverage', detail: 'One mode in every collection' },
          ]}
        />
        <Note>
          18 of 250 variables have descriptions, all on Global neutral families and currently in Portuguese. The other 232 are empty. Visibility is mixed:
          97 hidden and 153 not hidden. Sys has 39 aliases, 27 to Global and 12 to Ref, plus 73 raw values. Typography alias coverage is 24/36; color
          remains 4/65. Adoption needs a separate usage audit.
        </Note>
        <div className="hmi-c6__dark">
          <Panel label="Useful next actions" statement="Start with the questions that unblock safe use and complete the current scales.">
            <p>
              Propose reviewers. Review size name mismatches, zero line heights, body uppercase, units, scopes, and font availability. Validate alpha
              export, breakpoint intent, repeated color meanings, and the gold alpha RGB difference. Refresh the complete reference alongside the
              guidance.
            </p>
            <p className="hmi-c6__closing">Complete the current foundations before adding speculative component layers or themes.</p>
          </Panel>
        </div>
      </Section>
    </DocPage>
  )
}

export const ScalingTheSystemAndItsDocumentation: StoryObj = { name: 'Scaling the system and its documentation', render: () => <Page /> }
