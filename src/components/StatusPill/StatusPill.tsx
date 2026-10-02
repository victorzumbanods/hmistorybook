import type { ReactNode } from 'react'
import './StatusPill.css'

export interface StatusPillProps {
  tone: 'success' | 'warning' | 'danger'
  children: ReactNode
}

/** Machine state, e.g. "Running", "Door open", "Error E21". */
export function StatusPill({ tone, children }: StatusPillProps) {
  return <span className={`hmi-status-pill hmi-status-pill--${tone}`}>{children}</span>
}
