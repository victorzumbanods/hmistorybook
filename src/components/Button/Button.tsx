import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Maps to the Figma component property "Variant". */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Optional leading icon (24×24 SVG). */
  icon?: ReactNode
  /** Stretch to the container width. */
  fullWidth?: boolean
}

export function Button({ variant = 'primary', icon, fullWidth, className, children, type = 'button', ...rest }: ButtonProps) {
  const classes = ['hmi-button', `hmi-button--${variant}`, fullWidth && 'hmi-button--full', className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classes} {...rest}>
      {icon && <span className="hmi-button__icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  )
}
