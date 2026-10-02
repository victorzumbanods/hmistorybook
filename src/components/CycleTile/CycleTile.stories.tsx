import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CycleTile } from './CycleTile'
import { BoltIcon, DropIcon, LeafIcon, ShirtIcon } from '../icons'

const meta = {
  title: 'Components/CycleTile',
  component: CycleTile,
  tags: ['autodocs'],
  args: { name: 'Normal', duration: '1h 05m', icon: <ShirtIcon />, selected: false },
} satisfies Meta<typeof CycleTile>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Selected: Story = { args: { selected: true } }
export const Disabled: Story = { args: { disabled: true } }

const cycles = [
  { name: 'Normal', duration: '1h 05m', icon: <ShirtIcon /> },
  { name: 'Quick', duration: '0h 30m', icon: <BoltIcon /> },
  { name: 'Delicates', duration: '0h 50m', icon: <DropIcon /> },
  { name: 'Eco', duration: '2h 10m', icon: <LeafIcon /> },
]

export const CycleGrid: Story = {
  render: function Render() {
    const [selected, setSelected] = useState('Normal')
    return (
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
        {cycles.map((c) => <CycleTile key={c.name} {...c} selected={selected === c.name} onSelect={() => setSelected(c.name)} />)}
      </div>
    )
  },
}
