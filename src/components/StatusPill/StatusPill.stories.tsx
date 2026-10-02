import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusPill } from './StatusPill'

const meta = {
  title: 'Components/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
  args: { tone: 'success', children: 'Running' },
} satisfies Meta<typeof StatusPill>
export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {}
export const Warning: Story = { args: { tone: 'warning', children: 'Door open' } }
export const Danger: Story = { args: { tone: 'danger', children: 'Error E21' } }
