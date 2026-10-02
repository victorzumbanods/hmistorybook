import type { Decorator, Preview } from '@storybook/react-vite'
import tokens from '../src/tokens/tokens.json'
import '../src/styles/base.css'

// One toolbar switch per multi-mode Figma collection (Theme, Density, …), generated from the tokens.
const modeCollections = tokens.collections.filter((c) => c.attribute)

const globalTypes = Object.fromEntries(
  modeCollections.map((c) => [
    c.slug,
    {
      description: `Figma collection "${c.name}"`,
      toolbar: {
        title: c.name,
        icon: c.slug === 'theme' ? 'mirror' : 'component',
        items: c.modes.map((m) => ({ value: m.slug, title: m.name })),
        dynamicTitle: true,
      },
    },
  ]),
)

const withFigmaModes: Decorator = (Story, context) => {
  for (const c of modeCollections) document.documentElement.setAttribute(c.attribute!, context.globals[c.slug] ?? c.defaultMode)
  return <Story />
}

const preview: Preview = {
  globalTypes,
  initialGlobals: Object.fromEntries(modeCollections.map((c) => [c.slug, c.defaultMode])),
  decorators: [withFigmaModes],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: { storySort: { order: ['Introduction', 'Foundations', 'Components', 'Examples'] } },
  },
}

export default preview
