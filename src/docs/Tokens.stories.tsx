import type { Meta, StoryObj } from '@storybook/react-vite'
import { TokenGallery } from './TokenGallery'

const meta = { title: 'Foundations/Figma Variables', tags: ['doc-page'], parameters: { layout: 'fullscreen', controls: { disable: true }, actions: { disable: true }, interactions: { disable: true } } } satisfies Meta
export default meta

export const All: StoryObj = { name: 'Figma Variables', render: () => <TokenGallery /> }
