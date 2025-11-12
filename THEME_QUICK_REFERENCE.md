# Theme System - Quick Reference

## 🎨 Colors
```css
var(--primary)      /* #7C5CFF - Purple */
var(--secondary)    /* #22D3EE - Cyan */
var(--tertiary)     /* #FF66C4 - Pink */
```

## 📦 Components

### Glass Card
```jsx
<div className="glass-card">Content</div>
<div className="glass-card-sm">Small card</div>
```

### Buttons
```jsx
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-glass">Glass</button>
```

### Layout
```jsx
<div className="page-container">
  <div className="grid grid-3">
    <div className="glass-card">Item</div>
  </div>
</div>
```

## 📏 Spacing
```css
var(--space-1)  /* 8px */
var(--space-2)  /* 16px */
var(--space-3)  /* 24px */
var(--space-4)  /* 32px */
var(--space-5)  /* 40px */
var(--space-6)  /* 48px */
```

## 🔤 Typography
```jsx
<h1>Heading 1</h1>              /* 48px */
<p>Body text</p>                /* 16px */
<span className="caption">Caption</span>  /* 14px */
<span className="numeric">123</span>      /* Space Grotesk */
```

## 🎭 Effects
```css
var(--shadow-glow)      /* Default shadow */
var(--shadow-primary)   /* Purple glow */
var(--shadow-secondary) /* Cyan glow */
```

## 📱 Responsive
- Mobile: < 768px (16px padding)
- Tablet: 768-1023px
- Desktop: > 1024px (40px padding)

## ⚡ Transitions
```css
var(--transition-fast)  /* 150ms */
var(--transition-base)  /* 300ms */
var(--transition-slow)  /* 500ms */
```
