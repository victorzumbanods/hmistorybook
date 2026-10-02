import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Callout, DocPage, Mono, Note, Section, Table, cssVar, resolved, token } from './Doc'
import './03-color-and-accessibility.css'

// Content: [HMI] Foundations › "Color and accessibility" (Figma 6:6222), verbatim.

const meta = { title: 'Foundations/Color and accessibility', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

/* Live specimen helpers: the Figma variable drives the color; the Figma snapshot value is the fallback
   until that variable is present in the synced tokens. */
const live = (name: string, fallback: string) => cssVar(name).replace(/\)$/, `, ${fallback})`)
const shown = (name: string, fallback: string) => ((token(name) && resolved(name)) || fallback).toUpperCase()

type Step = [step: string, fallback: string]

const NEUTRAL: Step[] = [
  ['100', '#F5F5F5'], ['200', '#E5E5E5'], ['300', '#D4D4D4'], ['400', '#A3A3A3'], ['500', '#737373'],
  ['600', '#525252'], ['700', '#404040'], ['800', '#262626'], ['900', '#171717'],
]
const NEUTRAL_ALPHA: Step[] = [
  ['100', '#F5F5F51F'], ['200', '#E5E5E51F'], ['300', '#D4D4D41F'], ['400', '#A3A3A31F'], ['500', '#7373731F'],
  ['600', '#5252521F'], ['700', '#4040401F'], ['800', '#2626261F'], ['900', '#1717171F'],
]
const GOLD: Step[] = [
  ['25', '#FFF8EA'], ['50', '#FFF0D4'], ['75', '#FFE8BE'], ['100', '#FFE0A7'], ['150', '#FFD073'], ['200', '#FDBF2F'],
  ['250', '#EEB111'], ['300', '#E1A600'], ['400', '#C28F00'], ['500', '#A47800'], ['600', '#866200'], ['700', '#6A4D00'],
  ['800', '#503900'], ['850', '#432F00'], ['900', '#362600'], ['950', '#2A1D00'], ['1000', '#1F1400'],
]
const GOLD_ALPHA: Step[] = [
  ['1', '#EEB01103'], ['2', '#EEB01105'], ['4', '#EEB0110A'], ['8', '#EEB01114'], ['12', '#EEB0111F'], ['24', '#EEB0113D'],
  ['36', '#EEB0115C'], ['48', '#EEB0117A'], ['60', '#EEB01199'], ['72', '#EEB011B8'], ['84', '#EEB011D6'], ['96', '#EEB011F5'],
]
const ORANGE: Step[] = [
  ['50', '#FFEEE5'], ['75', '#FFE5D8'], ['100', '#FFDCCB'], ['150', '#FFCAB0'], ['200', '#FFB893'], ['300', '#FF8F50'],
  ['400', '#EF6C00'], ['500', '#CA5B00'], ['600', '#A74A00'], ['700', '#853900'], ['800', '#642900'], ['900', '#451A00'],
  ['1000', '#290C00'],
]

function Ramp({ label, prefix, steps, chipMin, showHex = false }: { label: string; prefix: string; steps: Step[]; chipMin: number; showHex?: boolean }) {
  return (
    <div className="hmi-c3__ramp-block">
      <p className="hmi-doc__context">{label}</p>
      <div className="hmi-c3__ramp" style={{ '--chip-min': `${chipMin}px` } as CSSProperties}>
        {steps.map(([step, fallback]) => {
          const name = `${prefix}/${step}`
          return (
            <div key={step} className="hmi-c3__step" title={name}>
              <div className="hmi-c3__chip"><span style={{ background: live(name, fallback) }} /></div>
              <span className="hmi-c3__step-number">{step}</span>
              {showHex && <span className="hmi-c3__step-hex">{shown(name, fallback)}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CONTRAST = [
  { bg: ['color/neutral/800', '#262626'], fg: ['color/global/white', '#FFFFFF'], label: 'White on neutral/800', ratio: '15.13:1', result: 'PASS · normal text AA' },
  { bg: ['color/neutral/600', '#525252'], fg: ['color/global/white', '#FFFFFF'], label: 'White on neutral/600', ratio: '7.81:1', result: 'PASS · normal text AA' },
  { bg: ['color/identity/whirlpool-gold', '#EEB111'], fg: ['color/global/white', '#FFFFFF'], label: 'White on Whirlpool gold', ratio: '≈ 1.92:1', result: 'FAIL · normal text AA' },
  { bg: ['color/identity/whirlpool-gold', '#EEB111'], fg: ['color/global/black', '#000000'], label: 'Black on Whirlpool gold', ratio: '≈ 10.93:1', result: 'PASS · normal text AA' },
] as const

function Page() {
  return (
    <DocPage
      chapter={3}
      context="Token strategy / Chapter 03"
      title="Color and accessibility"
      summary="A palette supplies options. Semantic roles explain the choice. Accessibility proves that the choice works in context."
    >
      <Section
        context="Current state"
        title="Shared color foundations"
        explanation="Global includes three constants, nine solid neutrals, and nine alpha neutrals. Color remains unchanged at 129 variables across the three collections."
      >
        <div className="hmi-c3__constants">
          <div className="hmi-c3__constant">
            <div className="hmi-c3__bar hmi-c3__bar--outlined" style={{ background: live('color/global/white', '#FFFFFF') }} />
            <p className="hmi-c3__caption">color/global/white · {shown('color/global/white', '#FFFFFF')}</p>
          </div>
          <div className="hmi-c3__constant">
            <div className="hmi-c3__bar" style={{ background: live('color/global/black', '#000000') }} />
            <p className="hmi-c3__caption">color/global/black · {shown('color/global/black', '#000000')}</p>
          </div>
          <div className="hmi-c3__constant">
            <div className="hmi-c3__transparency" title="Transparency preview">
              <div className="hmi-c3__bar" style={{ background: live('color/global/transparent', 'rgba(255, 255, 255, 0)') }} />
            </div>
            <p className="hmi-c3__caption">color/global/transparent · white at alpha 0</p>
          </div>
        </div>
        <Ramp label="color/neutral · solid ramp" prefix="color/neutral" steps={NEUTRAL} chipMin={72} showHex />
        <Ramp label="color/neutral-alpha · composite ramp" prefix="color/neutral-alpha" steps={NEUTRAL_ALPHA} chipMin={72} />
        <Mono>
          Solid IDs: VariableID:3:2 through VariableID:3:10. Alpha IDs: VariableID:3:11 through VariableID:3:19. Each alpha token stores a color reference
          to its matching neutral and opacity:12. Descriptions specify 12% opacity across all nine steps.
        </Mono>
        <Callout title="Validate composite export support">
          These are not direct RGBA values or broken colors. Verify that the export tooling preserves both the color reference and opacity. Composite the
          result over the actual surface before calculating contrast.
        </Callout>
      </Section>

      <Section
        context="Current state"
        title="Brand and utility references"
        explanation="Ref: Whirlpool contains identity gold, 17 solid gold steps, 12 gold alpha steps, and 13 orange utility steps. All 43 color references are hidden from publishing."
      >
        <div className="hmi-c3__pair">
          <div className="hmi-c3__example" title="Bound identity gold">
            <div className="hmi-c3__gold-bar" style={{ background: live('color/identity/whirlpool-gold', '#EEB111') }} />
            <p className="hmi-c3__token-id">color/identity/whirlpool-gold</p>
            <p className="hmi-c3__example-caption">VariableID:2:117 · {shown('color/identity/whirlpool-gold', '#EEB111')}</p>
          </div>
          <div className="hmi-c3__example" title="Bound reference gold">
            <div className="hmi-c3__gold-bar" style={{ background: live('color/brand/gold/250', '#EEB111') }} />
            <p className="hmi-c3__token-id">color/brand/gold/250</p>
            <p className="hmi-c3__example-caption">VariableID:2:128 · {shown('color/brand/gold/250', '#EEB111')}</p>
          </div>
        </div>
        <Note>Identity gold and gold/250 store the same raw value. They are not aliases of one another.</Note>
        <Ramp label="color/brand/gold · 17 solid steps" prefix="color/brand/gold" steps={GOLD} chipMin={48} />
        <Ramp label="Gold alpha · 12 opacity steps" prefix="color/brand/gold-alpha" steps={GOLD_ALPHA} chipMin={60} />
        <Ramp label="Orange utility · 13 steps" prefix="color/utility/orange" steps={ORANGE} chipMin={56} />
        <Mono>
          Gold solid IDs: VariableID:2:122 through VariableID:2:138. Gold alpha IDs: VariableID:2:139 through VariableID:2:150. Orange IDs: VariableID:2:151
          through VariableID:2:163. No semantic color alias currently points to these references.
        </Mono>
        <Callout title="Review question: is the RGB difference intentional?">
          Gold alpha uses RGB #EEB011, while identity gold is #EEB111. Review the intended relationship before making a correction. Matching values alone do
          not prove intent, and differing values alone do not prove an error.
        </Callout>
      </Section>

      <Section
        context="Current state"
        title="Semantic coverage is uneven"
        explanation="65 semantic colors describe roles: four surfaces, 24 fills, 24 borders, and 13 content entries. Most do not yet provide visibly distinct outcomes."
      >
        <Table
          columns={['Category', 'Entries', 'Current mapping and behavior']}
          widths={['21%', '10%', '69%']}
          rows={[
            ['Surface', '4', 'Four aliases to Global neutrals. Resolved colors include #171717, #262626, and #525252.'],
            ['Fill', '24', 'Direct values. Role families include neutral, brand, information, positive, notice, and negative.'],
            ['Border', '24', 'Direct values. Role and detail coverage differs across families.'],
            ['Content', '13', 'Direct values. These roles remain under color/background/content in the current taxonomy.'],
            ['Total', '65', '4 color aliases + 61 raw colors. 40 raw colors are #262626 and 21 raw colors are #525252.'],
          ]}
        />
        <div className="hmi-c3__statement">
          <h3>Different names do not yet mean different feedback colors.</h3>
          <p>
            Information, positive, notice, and negative roles need validation. Repeated neutral values may be intentional, unfinished, or context dependent.
            Names alone do not establish the intended outcome.
          </p>
          <p>
            Define behavior for active, ghost, and disabled before use. Ghost is not currently transparent. Prefer reviewed semantic roles, and validate the
            actual surface and content pair before adoption.
          </p>
        </div>
        <Note>
          Each collection still has one mode. No mode is named Light or Dark. Typography now links Sys to Ref, but color does not. Dark values are not
          evidence of theme support.
        </Note>
      </Section>

      <Section
        context="Current state"
        title="Contrast is evidence"
        explanation="These calculated opaque pairs are examples, not approval of every possible semantic combination."
      >
        <div className="hmi-c3__contrast">
          {CONTRAST.map((c) => (
            <div
              key={c.label}
              className="hmi-c3__card"
              title={`${c.fg[0]} on ${c.bg[0]}`}
              style={{ background: live(c.bg[0], c.bg[1]), color: live(c.fg[0], c.fg[1]) }}
            >
              <span className="hmi-c3__card-label">{c.label}</span>
              <span className="hmi-c3__card-ratio">{c.ratio}</span>
              <span className="hmi-c3__card-result">{c.result}</span>
            </div>
          ))}
        </div>
        <Table
          columns={['Requirement', 'Minimum contrast', 'Practical rule']}
          rows={[
            ['Normal text · AA', '4.5:1', 'Test the actual foreground and background pair.'],
            ['Large text · AA', '3:1', 'At least 18pt regular or 14pt bold.'],
            ['Essential UI and graphical indicators', '3:1 where applicable', 'Check necessary boundaries, indicators, and interactive states.'],
            ['Alpha colors', 'Calculate after compositing', 'Use the real background and resulting visible color.'],
          ]}
        />
        <Callout title="Use more than color to communicate status">
          Pair feedback with a meaningful label, icon, or pattern. Gold contrast uses opaque #EEB111. It is shown as a source color, not as an approved
          semantic role.
        </Callout>
      </Section>
    </DocPage>
  )
}

export const ColorAndAccessibility: StoryObj = { name: 'Color and accessibility', render: () => <Page /> }
