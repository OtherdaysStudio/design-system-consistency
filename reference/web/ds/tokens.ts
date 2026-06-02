// AUTO-GENERATED from reference/design-system.json — do not edit by hand.
// Usage: style={{ background: token.color.action.primary, padding: token.space.md }}
export const token = {
  "neutral": {
    "0": "var(--neutral-0)",
    "50": "var(--neutral-50)",
    "100": "var(--neutral-100)",
    "200": "var(--neutral-200)",
    "300": "var(--neutral-300)",
    "400": "var(--neutral-400)",
    "500": "var(--neutral-500)",
    "700": "var(--neutral-700)",
    "900": "var(--neutral-900)"
  },
  "blue": {
    "100": "var(--blue-100)",
    "500": "var(--blue-500)",
    "600": "var(--blue-600)"
  },
  "red": {
    "100": "var(--red-100)",
    "500": "var(--red-500)",
    "600": "var(--red-600)"
  },
  "green": {
    "100": "var(--green-100)",
    "500": "var(--green-500)"
  },
  "amber": {
    "100": "var(--amber-100)",
    "500": "var(--amber-500)"
  },
  "alpha": {
    "shadow": "var(--alpha-shadow)"
  },
  "space": {
    "none": "var(--space-none)",
    "xs": "var(--space-xs)",
    "sm": "var(--space-sm)",
    "md": "var(--space-md)",
    "lg": "var(--space-lg)",
    "xl": "var(--space-xl)",
    "xxl": "var(--space-xxl)",
    "xxxl": "var(--space-xxxl)"
  },
  "radius": {
    "sm": "var(--radius-sm)",
    "md": "var(--radius-md)",
    "lg": "var(--radius-lg)",
    "pill": "var(--radius-pill)"
  },
  "size": {
    "control": {
      "sm": "var(--size-control-sm)",
      "md": "var(--size-control-md)",
      "lg": "var(--size-control-lg)"
    },
    "icon": {
      "sm": "var(--size-icon-sm)",
      "md": "var(--size-icon-md)",
      "lg": "var(--size-icon-lg)"
    }
  },
  "fontSize": {
    "xs": "var(--font-size-xs)",
    "sm": "var(--font-size-sm)",
    "md": "var(--font-size-md)",
    "lg": "var(--font-size-lg)",
    "xl": "var(--font-size-xl)",
    "xxl": "var(--font-size-xxl)"
  },
  "fontWeight": {
    "regular": "var(--font-weight-regular)",
    "medium": "var(--font-weight-medium)",
    "semibold": "var(--font-weight-semibold)",
    "bold": "var(--font-weight-bold)"
  },
  "lineHeight": {
    "tight": "var(--line-height-tight)",
    "snug": "var(--line-height-snug)",
    "normal": "var(--line-height-normal)"
  },
  "borderWidth": {
    "thin": "var(--border-width-thin)",
    "thick": "var(--border-width-thick)"
  },
  "color": {
    "bg": {
      "canvas": "var(--color-bg-canvas)",
      "surface": "var(--color-bg-surface)",
      "muted": "var(--color-bg-muted)",
      "inverse": "var(--color-bg-inverse)"
    },
    "text": {
      "primary": "var(--color-text-primary)",
      "secondary": "var(--color-text-secondary)",
      "muted": "var(--color-text-muted)",
      "onAction": "var(--color-text-on-action)"
    },
    "action": {
      "primary": "var(--color-action-primary)",
      "primaryHover": "var(--color-action-primary-hover)",
      "secondary": "var(--color-action-secondary)",
      "danger": "var(--color-action-danger)",
      "dangerHover": "var(--color-action-danger-hover)"
    },
    "border": {
      "default": "var(--color-border-default)",
      "strong": "var(--color-border-strong)",
      "focus": "var(--color-border-focus)"
    },
    "status": {
      "success": "var(--color-status-success)",
      "successBg": "var(--color-status-success-bg)",
      "warning": "var(--color-status-warning)",
      "warningBg": "var(--color-status-warning-bg)",
      "danger": "var(--color-status-danger)",
      "dangerBg": "var(--color-status-danger-bg)",
      "info": "var(--color-status-info)",
      "infoBg": "var(--color-status-info-bg)"
    }
  },
  "button": {
    "radius": "var(--button-radius)",
    "paddingX": "var(--button-padding-x)",
    "gap": "var(--button-gap)",
    "bg": {
      "primary": "var(--button-bg-primary)"
    },
    "fg": {
      "primary": "var(--button-fg-primary)"
    }
  },
  "card": {
    "radius": "var(--card-radius)",
    "padding": "var(--card-padding)",
    "bg": "var(--card-bg)",
    "border": "var(--card-border)"
  },
  "input": {
    "height": "var(--input-height)",
    "radius": "var(--input-radius)",
    "paddingX": "var(--input-padding-x)"
  },
  "badge": {
    "radius": "var(--badge-radius)",
    "paddingX": "var(--badge-padding-x)"
  },
  "shadow": {
    "sm": "var(--shadow-sm)",
    "md": "var(--shadow-md)",
    "lg": "var(--shadow-lg)"
  }
} as const;

export type TypographyVariant = "display" | "heading" | "title" | "body" | "label" | "caption";
