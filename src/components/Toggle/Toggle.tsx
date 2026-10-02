import './Toggle.css'

export interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
}

/** On/off option, e.g. "Steam" or "Extra rinse". */
export function Toggle({ label, description, checked, onChange, disabled }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="hmi-toggle" disabled={disabled} onClick={() => onChange?.(!checked)}>
      <span className="hmi-toggle__text">
        <span className="hmi-toggle__label">{label}</span>
        {description && <span className="hmi-toggle__description">{description}</span>}
      </span>
      <span className="hmi-toggle__track" aria-hidden="true">
        <span className="hmi-toggle__thumb" />
      </span>
    </button>
  )
}
