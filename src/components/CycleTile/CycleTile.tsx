import type { ReactNode } from 'react'
import './CycleTile.css'

export interface CycleTileProps {
  name: string
  /** Estimated duration, e.g. "1h 05m". */
  duration?: string
  icon?: ReactNode
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
}

/** Selectable wash/dry cycle on the appliance panel. */
export function CycleTile({ name, duration, icon, selected = false, disabled, onSelect }: CycleTileProps) {
  return (
    <button type="button" className="hmi-cycle-tile" aria-pressed={selected} disabled={disabled} onClick={onSelect}>
      {icon && <span className="hmi-cycle-tile__icon" aria-hidden="true">{icon}</span>}
      <span className="hmi-cycle-tile__name">{name}</span>
      {duration && <span className="hmi-cycle-tile__duration">{duration}</span>}
    </button>
  )
}
