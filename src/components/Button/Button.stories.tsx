import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { PlayIcon, PauseIcon } from '../icons'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Start', variant: 'primary', disabled: false },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { icon: <PlayIcon /> } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Pause', icon: <PauseIcon /> } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Cancel' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Stop cycle' } }
export const Disabled: Story = { args: { disabled: true } }

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
      <Button icon={<PlayIcon />}>Start</Button>
      <Button variant="secondary" icon={<PauseIcon />}>Pause</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Stop cycle</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
}
