# Shopping Optimizer Design System

This directory contains the comprehensive design system for the Shopping Optimizer UI redesign. The design system provides consistent theming, spacing, typography, colors, and utility classes.

## Architecture

### Files Structure

```
src/styles/
├── design-system.css    # Core design tokens and utility classes
├── components.css       # Reusable component styles
└── README.md           # This documentation
```

### Import Order

The design system should be imported in the following order in `index.css`:

```css
@import './styles/design-system.css';
@import './styles/components.css';
```

## Design Tokens

### Typography System

The typography system uses the Inter font family with a comprehensive scale:

```css
/* Font Sizes (responsive) */
--font-size-xs: 0.75rem    /* 12px mobile, 14px desktop */
--font-size-sm: 0.875rem   /* 14px mobile, 16px desktop */
--font-size-base: 1rem     /* 16px mobile, 18px desktop */
--font-size-lg: 1.125rem   /* 18px mobile, 20px desktop */
--font-size-xl: 1.25rem    /* 20px mobile, 24px desktop */
--font-size-2xl: 1.5rem    /* 24px mobile, 28px desktop */
--font-size-3xl: 1.875rem  /* 30px mobile, 36px desktop */
--font-size-4xl: 2.25rem   /* 36px mobile, 48px desktop */
--font-size-5xl: 3rem      /* 48px mobile, 64px desktop */

/* Font Weights */
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 800
```

### Color System

#### Primary Colors (D-Mart Theme - Blue)
- `--color-blue-50` to `--color-blue-900` (9 shades)
- Used for D-Mart cards, buttons, and accents

#### Secondary Colors (Kirana Theme - Green)
- `--color-green-50` to `--color-green-900` (9 shades)
- Used for Kirana cards, success states, and nature-related elements

#### Neutral Colors
- `--color-gray-50` to `--color-gray-900` (9 shades)
- Used for text, backgrounds, and borders

#### Semantic Colors
- `--color-success`: Green 500
- `--color-warning`: Amber 500
- `--color-error`: Red 500
- `--color-info`: Blue 500

### Spacing System

Based on a 4px grid system:

```css
--spacing-0: 0
--spacing-px: 1px
--spacing-0-5: 0.125rem  /* 2px */
--spacing-1: 0.25rem     /* 4px */
--spacing-2: 0.5rem      /* 8px */
--spacing-3: 0.75rem     /* 12px */
--spacing-4: 1rem        /* 16px */
--spacing-5: 1.25rem     /* 20px */
--spacing-6: 1.5rem      /* 24px */
--spacing-8: 2rem        /* 32px */
--spacing-10: 2.5rem     /* 40px */
--spacing-12: 3rem       /* 48px */
/* ... up to --spacing-32 */
```

### Border Radius System

```css
--radius-none: 0
--radius-sm: 0.125rem    /* 2px */
--radius-base: 0.25rem   /* 4px */
--radius-md: 0.375rem    /* 6px */
--radius-lg: 0.5rem      /* 8px */
--radius-xl: 0.75rem     /* 12px */
--radius-2xl: 1rem       /* 16px */
--radius-3xl: 1.5rem     /* 24px */
--radius-full: 9999px    /* Fully rounded */
```

### Shadow System

```css
--shadow-xs: Subtle shadow for small elements
--shadow-sm: Small shadow for cards
--shadow-base: Default shadow
--shadow-md: Medium shadow for elevated elements
--shadow-lg: Large shadow for modals
--shadow-xl: Extra large shadow
--shadow-glass: Glass morphism shadow
--shadow-glass-lg: Large glass morphism shadow
```

## Component Classes

### Card Components

```css
.card                 /* Base card style */
.card--dmart         /* D-Mart themed card (blue) */
.card--kirana        /* Kirana themed card (green) */
.card__header        /* Card header layout */
.card__title         /* Card title styling */
.card__title--dmart  /* D-Mart title color */
.card__title--kirana /* Kirana title color */
.card__content       /* Card content area */
```

### Badge Components

```css
.badge               /* Base badge style */
.badge--savings      /* Green savings badge */
.badge--time         /* Purple time badge */
```

### Chip Components

```css
.chip                /* Base chip style */
.chip--dmart         /* D-Mart themed chip */
.chip--kirana        /* Kirana themed chip */
```

### Button Components

```css
.btn                 /* Base button style */
.btn--primary        /* Primary button (blue gradient) */
.btn--secondary      /* Secondary button (white with border) */
```

### Input Components

```css
.input               /* Base input style */
.input--error        /* Error state input */
.textarea            /* Textarea specific styles */
```

### Layout Components

```css
.items-grid          /* Responsive grid for item chips */
.summary             /* Summary stats container */
.summary__item       /* Individual stat item */
.summary__number     /* Large stat number */
.summary__label      /* Stat label */
.summary__divider    /* Divider between stats */
```

### State Components

```css
.empty-state         /* Empty state container */
.empty-state__icon   /* Empty state icon */
.empty-state__text   /* Empty state text */
.error-message       /* Error message container */
.error-message__icon /* Error message icon */
.tip-box             /* Tip/help box */
.tip-box__icon       /* Tip box icon */
.tip-box__text       /* Tip box text */
```

## Utility Classes

### Typography Utilities

```css
.text-xs, .text-sm, .text-base, .text-lg, .text-xl, .text-2xl, .text-3xl, .text-4xl, .text-5xl
.font-light, .font-normal, .font-medium, .font-semibold, .font-bold, .font-extrabold
.leading-tight, .leading-snug, .leading-normal, .leading-relaxed, .leading-loose
.tracking-tighter, .tracking-tight, .tracking-normal, .tracking-wide, .tracking-wider, .tracking-widest
.text-left, .text-center, .text-right, .text-justify
.uppercase, .lowercase, .capitalize
```

### Color Utilities

```css
.text-white, .text-black, .text-gray-*, .text-blue-*, .text-green-*
.bg-white, .bg-gray-*, .bg-blue-*, .bg-green-*
```

### Spacing Utilities

```css
.m-*, .mt-*, .mb-*, .ml-*, .mr-*, .mx-*, .my-*    /* Margins */
.p-*, .pt-*, .pb-*, .pl-*, .pr-*, .px-*, .py-*    /* Padding */
```

### Layout Utilities

```css
.flex, .inline-flex, .grid, .block, .inline-block, .hidden
.flex-row, .flex-col, .flex-wrap, .flex-nowrap
.items-start, .items-center, .items-end, .items-stretch
.justify-start, .justify-center, .justify-end, .justify-between, .justify-around
.gap-*
```

### Visual Utilities

```css
.rounded-*, .shadow-*, .transition-*, .duration-*, .ease-*
.transform, .translate-*, .scale-*, .hover\:*, .focus\:*
```

### Glass Morphism Utilities

```css
.glass       /* Standard glass effect */
.glass-light /* Light glass effect */
```

## Responsive Design

The design system uses a mobile-first approach with these breakpoints:

```css
--breakpoint-sm: 640px   /* Small tablets */
--breakpoint-md: 768px   /* Tablets */
--breakpoint-lg: 1024px  /* Small desktops */
--breakpoint-xl: 1280px  /* Large desktops */
--breakpoint-2xl: 1536px /* Extra large screens */
```

Responsive utilities are available with prefixes:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up

## Animation System

### Timing Functions

```css
--ease-linear: linear
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Duration

```css
--duration-75: 75ms
--duration-100: 100ms
--duration-150: 150ms
--duration-200: 200ms
--duration-300: 300ms
--duration-500: 500ms
--duration-700: 700ms
--duration-1000: 1000ms
```

### Animation Classes

```css
.animate-fade-in      /* Fade in animation */
.animate-slide-up     /* Slide up animation */
.animate-stagger-*    /* Staggered animation delays */
```

## Accessibility

The design system includes comprehensive accessibility features:

### Focus Management
- Visible focus indicators for all interactive elements
- Proper focus ring colors and sizing
- Support for `focus-visible` for keyboard-only focus

### Reduced Motion
- Respects `prefers-reduced-motion: reduce`
- Disables animations for users who prefer reduced motion

### Color Contrast
- All color combinations meet WCAG 2.1 AA standards
- High contrast mode support

### Touch Targets
- Minimum 44px touch targets on mobile devices
- Appropriate spacing between interactive elements

## Usage Examples

### Creating a D-Mart Card

```html
<div class="card card--dmart">
  <div class="card__header">
    <h3 class="card__title card__title--dmart">
      🛒 D-Mart Items
    </h3>
    <span class="badge badge--savings">Save 15%</span>
  </div>
  <div class="card__content">
    <div class="items-grid">
      <span class="chip chip--dmart">Rice</span>
      <span class="chip chip--dmart">Oil</span>
      <span class="chip chip--dmart">Sugar</span>
    </div>
  </div>
</div>
```

### Creating a Summary Section

```html
<div class="summary">
  <div class="summary__item">
    <div class="summary__number">5</div>
    <div class="summary__label">D-Mart</div>
  </div>
  <div class="summary__divider">|</div>
  <div class="summary__item">
    <div class="summary__number">3</div>
    <div class="summary__label">Kirana</div>
  </div>
</div>
```

### Using Utility Classes

```html
<div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
  <h2 class="text-xl font-semibold text-gray-900">Title</h2>
  <button class="btn btn--primary">Action</button>
</div>
```

## Migration Guide

When migrating existing components to use the design system:

1. **Replace custom CSS properties** with design system tokens
2. **Use component classes** instead of custom styles where possible
3. **Apply utility classes** for spacing, typography, and layout
4. **Test responsive behavior** across all breakpoints
5. **Verify accessibility** with screen readers and keyboard navigation

## Best Practices

1. **Use design tokens** instead of hardcoded values
2. **Prefer utility classes** for simple styling
3. **Create component classes** for complex, reusable patterns
4. **Follow mobile-first** responsive design principles
5. **Test accessibility** at every step
6. **Maintain consistency** with the established patterns

## Browser Support

The design system supports:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Features gracefully degrade in older browsers with appropriate fallbacks.