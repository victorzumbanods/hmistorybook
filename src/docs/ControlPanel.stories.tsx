import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, CycleTile, StatusPill, Stepper, Toggle } from '..'
import { BoltIcon, DropIcon, LeafIcon, PlayIcon, ShirtIcon } from '../components/icons'

const meta = { title: 'Examples/Washer control panel', parameters: { layout: 'fullscreen' } } satisfies Meta
export default meta

const cycles = [
  { name: 'Normal', duration: '1h 05m', icon: <ShirtIcon /> },
  { name: 'Quick', duration: '0h 30m', icon: <BoltIcon /> },
  { name: 'Delicates', duration: '0h 50m', icon: <DropIcon /> },
  { name: 'Eco', duration: '2h 10m', icon: <LeafIcon /> },
]

function Panel() {
  const [cycle, setCycle] = useState('Normal')
  const [temp, setTemp] = useState(40)
  const [steam, setSteam] = useState(true)
  const [rinse, setRinse] = useState(false)
  return (
    <div style={{ minHeight: '100vh', padding: 'var(--spacing-8)', background: 'var(--color-surface-sunken)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-default)', border: '1px solid var(--color-border-default)', display: 'grid', gap: 'var(--spacing-6)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>Choose a cycle</h1>
          <StatusPill tone="success">Ready</StatusPill>
        </header>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          {cycles.map((c) => <CycleTile key={c.name} {...c} selected={cycle === c.name} onSelect={() => setCycle(c.name)} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
          <Stepper label="Water temperature" value={temp} unit="°C" min={20} max={90} step={10} onChange={setTemp} />
          <div style={{ display: 'grid', gap: 'var(--spacing-3)', alignContent: 'end' }}>
            <Toggle label="Steam" checked={steam} onChange={setSteam} />
            <Toggle label="Extra rinse" checked={rinse} onChange={setRinse} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
          <Button variant="ghost">Cancel</Button>
          <Button icon={<PlayIcon />}>Start {cycle}</Button>
        </div>
      </div>
    </div>
  )
}

export const Default: StoryObj = { render: () => <Panel /> }
