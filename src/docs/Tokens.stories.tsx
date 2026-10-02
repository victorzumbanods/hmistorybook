import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenGallery } from './TokenGallery'

const meta = { title: 'Foundations/Figma Variables', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

export const All: StoryObj = { render: () => <TokenGallery /> }
export const Colors: StoryObj = { render: () => <TokenGallery filter={/^color\//} /> }
export const Spacing: StoryObj = { render: () => <TokenGallery filter={/^(spacing|radius|size)\//} /> }
export const Typography: StoryObj = { render: () => <TokenGallery filter={/^font\//} /> }
