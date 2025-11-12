# Admin Dashboard - Quick Reference

## 🎯 Layout Zones

### 1. Header Summary (Top)
```
┌─────────┬─────────┬─────────┬─────────┐
│ 👥      │ 🎮      │ ✓       │ ⭐      │
│ Teams   │ Games   │ Sessions│ Score   │
│ [====]  │ [====]  │ [====]  │ [====]  │
└─────────┴─────────┴─────────┴─────────┘
```

### 2. Quick Actions (Middle)
```
┌──────────┬──────────┬──────────┬──────────┐
│ Manage   │ Play     │ View     │ Live     │
│ Teams    │ Game     │ Results  │ Board    │
└──────────┴──────────┴──────────┴──────────┘
```

### 3. Admin Controls (Bottom)
```
┌──────────────┬──────────────┐
│ Event        │ Create       │
│ Control      │ Quiz         │
├──────────────┼──────────────┤
│ Manage       │ Settings     │
│ Quizzes      │              │
└──────────────┴──────────────┘
```

## 🎨 Component Usage

### Stat Card
```jsx
<StatCard
  icon="👥"
  value={25}
  label="Total Teams"
  progress={50}
  delay={0}
/>
```

### Action Button
```jsx
<QuickActionButton
  to="/teams"
  gradient="linear-gradient(135deg, #667eea, #764ba2)"
  icon="👥"
  label="Manage Teams"
  delay={0.4}
/>
```

### Control Card
```jsx
<ControlCard
  to="/settings"
  icon="⚙️"
  title="Settings"
  description="Configure preferences"
  delay={0.8}
/>
```

## 📏 Spacing

```css
space-1: 8px
space-2: 16px
space-3: 24px
space-4: 32px
space-5: 40px
```

## 🎭 Animations

- Counter: 1000ms (0 → value)
- Progress: 1000ms (delayed 300ms)
- Entrance: 300ms fade + slide
- Hover: Scale 1.05
- Tap: Scale 0.95

## 📱 Breakpoints

- Desktop: >1024px (4-4-2 grid)
- Tablet: 768-1023px (2-2-2 grid)
- Mobile: <768px (1-1-1 grid)

## 🎨 Gradients

```css
Blue:   #667eea → #764ba2
Green:  #48bb78 → #38a169
Purple: #9f7aea → #805ad5
Orange: #ed8936 → #dd6b20
```

## ⚡ Performance

- 60fps animations
- Auto-refresh: 30s
- Initial render: <100ms
- Bundle: ~8KB

## ♿ Accessibility

- Touch targets: 48x48px min
- Keyboard navigation: ✅
- Screen reader: ✅
- WCAG 2.1 AA: ✅

## 🔧 API

```
GET /api/admin/stats
{
  totalTeams: number,
  activeGames: number,
  completedSessions: number,
  averageScore: number
}
```

## 🚀 Quick Start

1. Navigate to `/admin`
2. View animated stats
3. Click action buttons
4. Access control cards
5. Stats auto-refresh every 30s
