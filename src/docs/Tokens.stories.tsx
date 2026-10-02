import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenGallery } from './TokenGallery'

const meta = { title: 'Foundations/Figma Variables', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

export const All: StoryObj = { name: 'Figma Variables', render: () => <TokenGallery /> }
