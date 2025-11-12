# Universal Theme & Layout System - Style Guide

## Color Palette

### Primary Colors
- **Primary Purple**: `#7C5CFF` - Main brand color, CTAs, highlights
- **Secondary Cyan**: `#22D3EE` - Secondary actions, info states
- **Tertiary Pink**: `#FF66C4` - Accents, special highlights

### Background
- **Gradient Start**: `#0B0F1A` (top)
- **Gradient End**: `#121A2A` (bottom)
- Applied as fixed linear gradient

### Glass Effects
- **Background**: `rgba(255, 255, 255, 0.05)`
- **Border**: `rgba(255, 255, 255, 0.1)`
- **Blur**: `20px`

## Typography

### Font Families
- **Primary**: Inter - All text content
- **Secondary**: Space Grotesk - Numbers and data visualization

### Scale
- H1: 48px (36px mobile)
- H2: 36px (28px mobile)
- H3: 28px (24px mobile)
- H4: 24px (20px mobile)
- H5: 20px
- H6: 18px
- Body: 16px
- Caption: 14px
- Small: 12px

## Spacing System (8px base)
- space-1: 8px
- space-2: 16px
- space-3: 24px
- space-4: 32px
- space-5: 40px
- space-6: 48px

## Border Radius
- Small elements: 16px
- Large containers: 24px

## Shadows
- Default: `0 8px 20px rgba(0,0,0,0.3)`
- Primary glow: `0 8px 20px rgba(124,92,255,0.3)`
- Secondary glow: `0 8px 20px rgba(34,211,238,0.3)`

## Layout
- Max width: 1400px
- Mobile padding: 16px
- Desktop padding: 40px
- Navigation spacing: 24px

## Transitions
- Fast: 150ms
- Base: 300ms
- Slow: 500ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## Components

### Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
```

### Buttons
- Primary: Purple background with glow
- Secondary: Cyan background with glow
- Glass: Transparent with border

### Navigation
- Fixed top position
- Glassmorphism effect
- Active state: underline animation
- Hover: glow effect

## Accessibility
- WCAG AA compliant contrast ratios
- Focus indicators on all interactive elements
- Keyboard navigation support
- Screen reader friendly

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
