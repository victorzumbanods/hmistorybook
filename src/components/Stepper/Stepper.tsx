import { useId } from 'react'
import './Stepper.css'

export interface StepperProps {
  label: string
  value: number
  unit?: string
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

/** − value + control, e.g. water temperature or delay start. */
export function Stepper({ label, value, unit, min = -Infinity, max = Infinity, step = 1, onChange }: StepperProps) {
  const id = useId()
  const set = (next: number) => onChange?.(Math.min(max, Math.max(min, next)))
  return (
    <div className="hmi-stepper" role="group" aria-labelledby={id}>
      <span className="hmi-stepper__label" id={id}>{label}</span>
      <div className="hmi-stepper__row">
        <button type="button" className="hmi-stepper__button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => set(value - step)}>−</button>
        <output className="hmi-stepper__value" aria-live="polite">
          {value}
          {unit && <span className="hmi-stepper__unit">{unit}</span>}
        </output>
        <button type="button" className="hmi-stepper__button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => set(value + step)}>+</button>
      </div>
    </div>
  )
}
