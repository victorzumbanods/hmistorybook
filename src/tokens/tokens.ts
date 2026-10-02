// AUTO-GENERATED from tokens/figma-variables.json by scripts/build-tokens.mjs — do not edit.

export const vars = {
  "size": {
    "control": {
      "font-size": "var(--size-control-font-size)",
      "gap": "var(--size-control-gap)",
      "height": "var(--size-control-height)",
      "padding-x": "var(--size-control-padding-x)",
      "radius": "var(--size-control-radius)"
    },
    "icon": "var(--size-icon)",
    "tile": {
      "min-width": "var(--size-tile-min-width)",
      "padding": "var(--size-tile-padding)"
    }
  },
  "color": {
    "amber": {
      "100": "var(--color-amber-100)",
      "500": "var(--color-amber-500)",
      "700": "var(--color-amber-700)"
    },
    "brand": {
      "100": "var(--color-brand-100)",
      "200": "var(--color-brand-200)",
      "300": "var(--color-brand-300)",
      "400": "var(--color-brand-400)",
      "500": "var(--color-brand-500)",
      "600": "var(--color-brand-600)",
      "700": "var(--color-brand-700)",
      "800": "var(--color-brand-800)",
      "900": "var(--color-brand-900)"
    },
    "green": {
      "100": "var(--color-green-100)",
      "500": "var(--color-green-500)",
      "700": "var(--color-green-700)"
    },
    "neutral": {
      "0": "var(--color-neutral-0)",
      "50": "var(--color-neutral-50)",
      "100": "var(--color-neutral-100)",
      "200": "var(--color-neutral-200)",
      "300": "var(--color-neutral-300)",
      "400": "var(--color-neutral-400)",
      "500": "var(--color-neutral-500)",
      "600": "var(--color-neutral-600)",
      "700": "var(--color-neutral-700)",
      "800": "var(--color-neutral-800)",
      "900": "var(--color-neutral-900)",
      "1000": "var(--color-neutral-1000)"
    },
    "red": {
      "100": "var(--color-red-100)",
      "500": "var(--color-red-500)",
      "700": "var(--color-red-700)"
    },
    "action": {
      "disabled": "var(--color-action-disabled)",
      "primary": {
        "default": "var(--color-action-primary-default)",
        "hover": "var(--color-action-primary-hover)",
        "pressed": "var(--color-action-primary-pressed)"
      },
      "secondary": {
        "default": "var(--color-action-secondary-default)",
        "hover": "var(--color-action-secondary-hover)",
        "text": "var(--color-action-secondary-text)"
      }
    },
    "border": {
      "default": "var(--color-border-default)",
      "focus": "var(--color-border-focus)",
      "strong": "var(--color-border-strong)"
    },
    "selected": {
      "background": "var(--color-selected-background)",
      "border": "var(--color-selected-border)"
    },
    "status": {
      "danger": {
        "default": "var(--color-status-danger-default)",
        "subtle": "var(--color-status-danger-subtle)"
      },
      "success": {
        "default": "var(--color-status-success-default)",
        "subtle": "var(--color-status-success-subtle)"
      },
      "warning": {
        "default": "var(--color-status-warning-default)",
        "subtle": "var(--color-status-warning-subtle)"
      }
    },
    "surface": {
      "default": "var(--color-surface-default)",
      "raised": "var(--color-surface-raised)",
      "sunken": "var(--color-surface-sunken)"
    },
    "text": {
      "disabled": "var(--color-text-disabled)",
      "on-action": "var(--color-text-on-action)",
      "primary": "var(--color-text-primary)",
      "secondary": "var(--color-text-secondary)"
    }
  },
  "font": {
    "family": {
      "sans": "var(--font-family-sans)"
    },
    "size": {
      "2xl": "var(--font-size-2xl)",
      "display": "var(--font-size-display)",
      "lg": "var(--font-size-lg)",
      "md": "var(--font-size-md)",
      "sm": "var(--font-size-sm)",
      "xl": "var(--font-size-xl)",
      "xs": "var(--font-size-xs)"
    },
    "weight": {
      "bold": "var(--font-weight-bold)",
      "medium": "var(--font-weight-medium)",
      "regular": "var(--font-weight-regular)"
    }
  },
  "radius": {
    "full": "var(--radius-full)",
    "lg": "var(--radius-lg)",
    "md": "var(--radius-md)",
    "none": "var(--radius-none)",
    "sm": "var(--radius-sm)"
  },
  "spacing": {
    "0": "var(--spacing-0)",
    "1": "var(--spacing-1)",
    "2": "var(--spacing-2)",
    "3": "var(--spacing-3)",
    "4": "var(--spacing-4)",
    "5": "var(--spacing-5)",
    "6": "var(--spacing-6)",
    "8": "var(--spacing-8)",
    "10": "var(--spacing-10)",
    "12": "var(--spacing-12)"
  }
} as const

export const modes = {
  "density": [
    "touch",
    "compact"
  ],
  "theme": [
    "light",
    "dark"
  ]
} as const

export type CssVar =
  | '--size-control-font-size'
  | '--size-control-gap'
  | '--size-control-height'
  | '--size-control-padding-x'
  | '--size-control-radius'
  | '--size-icon'
  | '--size-tile-min-width'
  | '--size-tile-padding'
  | '--color-amber-100'
  | '--color-amber-500'
  | '--color-amber-700'
  | '--color-brand-100'
  | '--color-brand-200'
  | '--color-brand-300'
  | '--color-brand-400'
  | '--color-brand-500'
  | '--color-brand-600'
  | '--color-brand-700'
  | '--color-brand-800'
  | '--color-brand-900'
  | '--color-green-100'
  | '--color-green-500'
  | '--color-green-700'
  | '--color-neutral-0'
  | '--color-neutral-100'
  | '--color-neutral-1000'
  | '--color-neutral-200'
  | '--color-neutral-300'
  | '--color-neutral-400'
  | '--color-neutral-50'
  | '--color-neutral-500'
  | '--color-neutral-600'
  | '--color-neutral-700'
  | '--color-neutral-800'
  | '--color-neutral-900'
  | '--color-red-100'
  | '--color-red-500'
  | '--color-red-700'
  | '--font-family-sans'
  | '--font-size-2xl'
  | '--font-size-display'
  | '--font-size-lg'
  | '--font-size-md'
  | '--font-size-sm'
  | '--font-size-xl'
  | '--font-size-xs'
  | '--font-weight-bold'
  | '--font-weight-medium'
  | '--font-weight-regular'
  | '--radius-full'
  | '--radius-lg'
  | '--radius-md'
  | '--radius-none'
  | '--radius-sm'
  | '--spacing-0'
  | '--spacing-1'
  | '--spacing-10'
  | '--spacing-12'
  | '--spacing-2'
  | '--spacing-3'
  | '--spacing-4'
  | '--spacing-5'
  | '--spacing-6'
  | '--spacing-8'
  | '--color-action-disabled'
  | '--color-action-primary-default'
  | '--color-action-primary-hover'
  | '--color-action-primary-pressed'
  | '--color-action-secondary-default'
  | '--color-action-secondary-hover'
  | '--color-action-secondary-text'
  | '--color-border-default'
  | '--color-border-focus'
  | '--color-border-strong'
  | '--color-selected-background'
  | '--color-selected-border'
  | '--color-status-danger-default'
  | '--color-status-danger-subtle'
  | '--color-status-success-default'
  | '--color-status-success-subtle'
  | '--color-status-warning-default'
  | '--color-status-warning-subtle'
  | '--color-surface-default'
  | '--color-surface-raised'
  | '--color-surface-sunken'
  | '--color-text-disabled'
  | '--color-text-on-action'
  | '--color-text-primary'
  | '--color-text-secondary'
