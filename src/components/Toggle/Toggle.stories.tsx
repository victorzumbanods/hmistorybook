import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from './Toggle'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { label: 'Steam', description: 'Reduces wrinkles and odors', checked: true },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked)
    return <div style={{ maxWidth: 360 }}><Toggle {...args} checked={checked} onChange={setChecked} /></div>
  },
} satisfies Meta<typeof Toggle>
export default meta
type Story = StoryObj<typeof meta>

export const On: Story = {}
export const Off: Story = { args: { checked: false, label: 'Extra rinse', description: undefined } }
export const Disabled: Story = { args: { disabled: true } }
