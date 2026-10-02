import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from './Stepper'

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { label: 'Water temperature', value: 40, unit: '°C', min: 20, max: 90, step: 10 },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    return <div style={{ maxWidth: 320 }}><Stepper {...args} value={value} onChange={setValue} /></div>
  },
} satisfies Meta<typeof Stepper>
export default meta
type Story = StoryObj<typeof meta>

export const Temperature: Story = {}
export const DelayStart: Story = { args: { label: 'Delay start', value: 0, unit: 'h', min: 0, max: 12, step: 1 } }
