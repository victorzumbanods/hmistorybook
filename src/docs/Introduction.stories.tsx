import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import tokensFile from '../tokens/tokens.json'
import { CHAPTERS, TOKENS, cssVar } from './foundations/Doc'
import './intro.css'

const meta = { title: 'Introduction', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

const collections = (tokensFile as unknown as { collections: { name: string; modes: { name: string }[] }[] }).collections

const SUMMARIES: Record<string, string> = {
  '01': 'Choose meaning, not copied values. A shared vocabulary makes design decisions easier to understand, reuse, and evolve.',
  '02': 'A name carries intent. An alias carries a relationship. Document both so the architecture stays understandable as it grows.',
  '03': 'A palette supplies options. Semantic roles explain the choice. Accessibility proves that the choice works in context.',
  '04': 'Numeric primitives keep geometry consistent. Semantic labels make the same choices easier to read in everyday design work.',
  '05': 'Brand inputs are the starting point. A usable typography system also needs validated font styles, a scale, and clear reading roles.',
  '06': 'Scale decisions and documentation together. Every addition should have a reason, a reviewer, and a clear path from source to release.',
}

const LINKS = {
  foundations: 'https://www.figma.com/design/yIDVfY54pEzUhKguHqDRMI/-HMI--Foundations',
  components: 'https://www.figma.com/design/5aomRHUg7QuWqFVLgioKTt/-HMI--Core-Components',
  repo: 'https://github.com/victorzumbanods/hmistorybook',
}
const story = (id: string) => `./?path=/story/${id}`
const GALLERY = 'foundations-figma-variables--all'

// ---------- live numbers from src/tokens/tokens.json

const count = (pred: (t: (typeof TOKENS)[number]) => boolean) => TOKENS.filter(pred).length
const inCollection = (name: string) => TOKENS.filter((t) => t.collection === name)
const typeMix = (name: string) => {
  const list = inCollection(name)
  return (['COLOR', 'FLOAT', 'STRING'] as const).map((type) => ({ type, n: list.filter((t) => t.type === type).length }))
}
const chipsFor = (name: string, max = 24) =>
  inCollection(name)
    .filter((t) => t.type === 'COLOR' && !/alpha|transparent/.test(t.name))
    .slice(0, max)

function Collection({ name, role, sys }: { name: string; role: string; sys?: boolean }) {
  const list = inCollection(name)
  const mix = typeMix(name)
  const modes = collections.find((c) => c.name === name)?.modes.length ?? 0
  return (
    <div className={`hmi-intro__col${sys ? ' hmi-intro__col--sys' : ''}`}>
      <p className="hmi-intro__col-role">{role}</p>
      <h3>{name}</h3>
      <p className="hmi-intro__col-count">{list.length}</p>
      <div className="hmi-intro__types" aria-hidden="true">
        {mix.map((m) => <span key={m.type} style={{ width: `${(m.n / Math.max(list.length, 1)) * 100}%` }} />)}
      </div>
      <p className="hmi-intro__col-meta">
        {mix.map((m) => `${m.n} ${m.type}`).join(' · ')}
        <br />
        {modes} mode{modes === 1 ? '' : 's'}
      </p>
      <div className="hmi-intro__chips" aria-hidden="true">
        {chipsFor(name).map((t) => <span key={t.name} title={t.name} style={{ background: `var(${t.cssVar})` }} />)}
      </div>
    </div>
  )
}

function Page() {
  const total = TOKENS.length
  const colors = count((t) => t.type === 'COLOR')
  const described = count((t) => !!t.description)

  return (
    <main className="hmi-intro">
      <div className="hmi-intro__wrap">
        {/* ---------- hero */}
        <header className="hmi-intro__hero">
          <div className="hmi-intro__hero-top">
            <img className="hmi-intro__logo" src="logos/logo_white.png" alt="Saturn" />
            <span className="hmi-intro__badge">Synced from Figma variables</span>
          </div>
          <div className="hmi-intro__hero-body">
            <p className="hmi-intro__eyebrow">Whirlpool · HMI Design System</p>
            <h1>HMI Storybook</h1>
            <p className="hmi-intro__lead">
              The living reference for Whirlpool appliance interfaces. Every color, size, and type role on these pages is read from the HMI Figma variables and
              rebuilt automatically when they change.
            </p>
            <div className="hmi-intro__ctas">
              <a className="hmi-intro__cta hmi-intro__cta--primary" href={story(CHAPTERS[0].id)} target="_top">Read the foundations →</a>
              <a className="hmi-intro__cta hmi-intro__cta--ghost" href={story(GALLERY)} target="_top">Browse every variable</a>
            </div>
          </div>
          <div className="hmi-intro__hero-stats">
            <div className="hmi-intro__hero-stat"><b>{total}</b><span>Figma variables</span></div>
            <div className="hmi-intro__hero-stat"><b>{collections.length}</b><span>Collections</span></div>
            <div className="hmi-intro__hero-stat"><b>{colors}</b><span>Color tokens</span></div>
            <div className="hmi-intro__hero-stat"><b>{CHAPTERS.length}</b><span>Foundation chapters</span></div>
          </div>
          <p className="hmi-intro__credits">Collaborators: Victor Zumbano, Eric Cheng</p>
        </header>

        {/* ---------- structure */}
        <section className="hmi-intro__block">
          <div className="hmi-intro__head">
            <div className="hmi-intro__head-text">
              <p className="hmi-intro__kicker"><b>01</b>How it is organized</p>
              <h2 className="hmi-intro__h2">Three layers, one source of truth.</h2>
              <p className="hmi-intro__sub">Foundations explain the decisions, the variable gallery shows every value, and components put them to work.</p>
            </div>
          </div>
          <div className="hmi-intro__areas">
            <a className="hmi-intro__area" href={story(CHAPTERS[0].id)} target="_top">
              <span className="hmi-intro__area-n">Foundations</span>
              <h3>Strategy and guidance</h3>
              <p>Six chapters from the [HMI] Foundations file: token strategy, architecture, color, geometry, typography, and how the system scales.</p>
              <span className="hmi-intro__area-foot"><span className="hmi-intro__tag hmi-intro__tag--live">6 chapters</span>Read →</span>
            </a>
            <a className="hmi-intro__area" href={story(GALLERY)} target="_top">
              <span className="hmi-intro__area-n">Figma Variables</span>
              <h3>Every token, live</h3>
              <p>All {total} variables with their CSS name, collection, resolved value, and alias chain. Swatches render the real CSS variables.</p>
              <span className="hmi-intro__area-foot"><span className="hmi-intro__tag hmi-intro__tag--live">Auto-generated</span>Browse →</span>
            </a>
            <a className="hmi-intro__area" href={LINKS.components} target="_blank" rel="noreferrer">
              <span className="hmi-intro__area-n">Components</span>
              <h3>Core components</h3>
              <p>Designed in [HMI] Core Components and built in React here, consuming only Sys: Semantic tokens so every change in Figma flows through.</p>
              <span className="hmi-intro__area-foot"><span className="hmi-intro__tag hmi-intro__tag--wip">In progress</span>Figma ↗</span>
            </a>
          </div>
        </section>

        {/* ---------- chapters */}
        <section className="hmi-intro__block">
          <div className="hmi-intro__head">
            <div className="hmi-intro__head-text">
              <p className="hmi-intro__kicker"><b>02</b>Foundations</p>
              <h2 className="hmi-intro__h2">Read the strategy, chapter by chapter.</h2>
              <p className="hmi-intro__sub">Each chapter stands alone. Together they connect the current inventory with a practical path to maintain it.</p>
            </div>
          </div>
          <div className="hmi-intro__chapters">
            {CHAPTERS.map((c) => (
              <a key={c.n} className="hmi-intro__chapter" href={story(c.id)} target="_top">
                <span className="hmi-intro__chapter-n">{c.n}</span>
                <h3>{c.title}</h3>
                <p>{SUMMARIES[c.n]}</p>
                <span className="hmi-intro__chapter-link">Open chapter →</span>
              </a>
            ))}
          </div>
        </section>

        {/* ---------- token architecture */}
        <section className="hmi-intro__block">
          <div className="hmi-intro__head">
            <div className="hmi-intro__head-text">
              <p className="hmi-intro__kicker"><b>03</b>Token architecture</p>
              <h2 className="hmi-intro__h2">Values, references, roles.</h2>
              <p className="hmi-intro__sub">
                Global holds shared values, Ref: Whirlpool holds brand references, and Sys: Semantic names the roles that interfaces use. Counts and colors below
                are read live from the variables.
              </p>
            </div>
            <div className="hmi-intro__legend">
              <span style={{ '--c': 'var(--i-accent)' } as CSSProperties}>Color</span>
              <span style={{ '--c': '#8a8a80' } as CSSProperties}>Number</span>
              <span style={{ '--c': '#c9c8bd' } as CSSProperties}>String</span>
            </div>
          </div>
          <div className="hmi-intro__arch">
            <Collection name="Ref: Whirlpool" role="Brand references" />
            <div className="hmi-intro__arrow"><i>→</i>referenced by</div>
            <Collection name="Sys: Semantic" role="Roles for interfaces" sys />
            <div className="hmi-intro__arrow"><i>←</i>referenced by</div>
            <Collection name="Global" role="Shared values" />
          </div>
        </section>

        {/* ---------- pipeline */}
        <section className="hmi-intro__block">
          <div className="hmi-intro__head">
            <div className="hmi-intro__head-text">
              <p className="hmi-intro__kicker"><b>04</b>From Figma to code</p>
              <h2 className="hmi-intro__h2">Change a variable. See it here in minutes.</h2>
              <p className="hmi-intro__sub">No copied hex values. The pipeline turns Figma variables into CSS custom properties and republishes this Storybook.</p>
            </div>
          </div>
          <div className="hmi-intro__flow">
            <div className="hmi-intro__step">
              <h3>Edit in Figma</h3>
              <p>Designers update variables in <strong>[HMI] Foundations</strong>. Names, values, aliases, and modes are the contract.</p>
            </div>
            <div className="hmi-intro__step">
              <h3>Sync to GitHub</h3>
              <p>The <strong>HMI Variables → GitHub</strong> plugin commits <code>tokens/figma-variables.json</code> with a list of what changed.</p>
            </div>
            <div className="hmi-intro__step">
              <h3>Build tokens</h3>
              <p>GitHub Actions generates <code>tokens.css</code>, keeping aliases as <code>var()</code> references, and builds Storybook.</p>
            </div>
            <div className="hmi-intro__step">
              <h3>Publish</h3>
              <p>The new Storybook is deployed to GitHub Pages. Every swatch, scale, and component picks up the new values.</p>
            </div>
          </div>
        </section>

        {/* ---------- usage */}
        <section className="hmi-intro__block">
          <div className="hmi-intro__head">
            <div className="hmi-intro__head-text">
              <p className="hmi-intro__kicker"><b>05</b>Using the tokens</p>
              <h2 className="hmi-intro__h2">Reference roles, not values.</h2>
            </div>
          </div>
          <div className="hmi-intro__code-grid">
            <div className="hmi-intro__rules">
              <p className="hmi-intro__rule"><b>01</b><span><strong>Use Sys: Semantic in components.</strong> Global and Ref are sources, not something to style with directly.</span></p>
              <p className="hmi-intro__rule"><b>02</b><span><strong>Names map 1:1.</strong> <code>color/background/surface/neutral/default</code> becomes <code>--color-background-surface-neutral-default</code>.</span></p>
              <p className="hmi-intro__rule"><b>03</b><span><strong>Rename with care.</strong> A renamed variable is a renamed CSS property. Update the components in the same change.</span></p>
              <p className="hmi-intro__rule"><b>04</b><span><strong>Describe as you go.</strong> Only {described} of {total} variables have a description today.</span></p>
            </div>
            <div>
              <pre className="hmi-intro__code">
                <span className="c">/* tokens.css is generated from Figma. Never edit it by hand. */</span>{'\n'}
                <span className="k">@import</span> <span className="s">'src/tokens/tokens.css'</span>;{'\n\n'}
                .panel {'{'}{'\n'}
                {'  '}background: <span className="k">var</span>(--color-background-surface-neutral-default);{'\n'}
                {'  '}border-radius: <span className="k">var</span>(--border-radius-md);{'\n'}
                {'  '}padding: <span className="k">var</span>(--spacing-16);{'\n'}
                {'}'}
              </pre>
              <div className="hmi-intro__preview">
                <div style={{ width: 120, height: 64, background: cssVar('color/background/surface/neutral/default'), borderRadius: cssVar('border/radius/md'), padding: cssVar('spacing/16') }}>
                  <div style={{ height: '100%', borderRadius: 4, background: cssVar('color/identity/whirlpool-gold') }} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--i-muted)' }}>Rendered with the live variables above.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- resources */}
        <section className="hmi-intro__block">
          <div className="hmi-intro__head">
            <div className="hmi-intro__head-text">
              <p className="hmi-intro__kicker"><b>06</b>Sources</p>
              <h2 className="hmi-intro__h2">Where everything lives.</h2>
            </div>
          </div>
          <div className="hmi-intro__links">
            <a className="hmi-intro__link" href={LINKS.foundations} target="_blank" rel="noreferrer">
              <small>Figma</small><strong>[HMI] Foundations</strong><span>Variables and strategy documentation</span>
            </a>
            <a className="hmi-intro__link" href={LINKS.components} target="_blank" rel="noreferrer">
              <small>Figma</small><strong>[HMI] Core Components</strong><span>Component designs</span>
            </a>
            <a className="hmi-intro__link" href={LINKS.repo} target="_blank" rel="noreferrer">
              <small>GitHub</small><strong>victorzumbanods/hmistorybook</strong><span>Code, tokens, plugin, and pipeline</span>
            </a>
          </div>
          <footer className="hmi-intro__foot">
            <span>Whirlpool · HMI Storybook</span>
            <span>Tokens generated from Figma variables · do not edit by hand</span>
          </footer>
        </section>
      </div>
    </main>
  )
}

export const Introduction: StoryObj = { name: 'Introduction', render: () => <Page /> }
