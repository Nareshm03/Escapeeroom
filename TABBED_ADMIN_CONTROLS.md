# Tabbed Admin Controls Documentation

## Overview
The Admin Controls section has been redesigned with a tabbed interface using Framer Motion for smooth animations and improved content organization.

## Features

### 1. Tab Structure
Four main tabs organize admin functionality:
- **System** ⚙️ - System administration and settings
- **Quizzes** 📝 - Quiz creation and management
- **Teams** 👥 - Team management and statistics
- **Reports** 📊 - Analytics and data exports

### 2. Content Organization
Each tab displays action cards with:
- Descriptive title
- 1-2 sentence description
- Icon indicator
- Consistent dimensions (280px minimum width)
- 20px gap spacing

### 3. Animations (Framer Motion)

#### Tab Switching
- Smooth spring animation for active indicator
- Fade/slide transitions (300ms duration)
- Exit animations for content switching

#### Card Interactions
- Hover: Scale 1.03, translateY -4px
- Tap: Scale 0.98
- Staggered appearance (100ms delay per card)

#### Content Loading
- Initial opacity 0, y: 20
- Animate to opacity 1, y: 0
- Staggered table rows (50ms delay)

### 4. Technical Implementation

#### State Management
```javascript
const [activeTab, setActiveTab] = useState('system');
```

#### Keyboard Navigation
- Tab key navigation between tabs
- Enter/Space to activate
- Arrow keys for tab switching
- Focus indicators on all interactive elements

#### ARIA Attributes
```jsx
role="tablist"
role="tab"
aria-selected={activeTab === tab.id}
aria-controls={`panel-${tab.id}`}
role="tabpanel"
```

### 5. Visual Design

#### Colors (from design system)
- Primary: #667eea
- Secondary: #764ba2
- Danger: #dc2626
- Text: #1f2937
- Muted: #6b7280

#### Typography
- Title: 24px, weight 700
- Tab: 14px, weight 500/600
- Card title: 18px, weight 600
- Card desc: 14px, weight 400

#### Spacing
- Container padding: 32px
- Tab gap: 8px
- Card gap: 20px
- Card padding: 24px

### 6. Responsive Design

#### Desktop (> 768px)
- Grid: auto-fit, minmax(280px, 1fr)
- Full tab labels visible
- 3 columns for action cards

#### Tablet (≤ 768px)
- Reduced padding: 20px
- Smaller fonts
- 2 columns for action cards

#### Mobile (≤ 480px)
- Tab icons only (labels hidden)
- Single column layout
- Compact spacing

### 7. Dark Mode Support
Full theme support with CSS custom properties:
```css
[data-theme="dark"] .tabbed-admin-controls {
  background: rgba(31, 41, 55, 0.95);
}
```

## Tab Content Structure

### System Tab
- Admin Panel - System administration and monitoring
- Settings - Configure global application settings
- Live Monitor - Real-time activity monitoring

### Quizzes Tab
- Create Quiz - Design new quiz challenges
- Quiz List - Manage and edit existing quizzes
- Results - View quiz results and analytics

### Teams Tab
- Manage Teams - Create and organize teams
- Team Stats - View team performance metrics
- Game Control - Manage active game sessions
- Teams Table - Full list of all teams (when available)

### Reports Tab
- Leaderboard - View rankings and top performers
- Analytics - Detailed performance analytics
- Export Data - Download reports and data exports

## Usage

```jsx
import TabbedAdminControls from '../components/TabbedAdminControls';

<TabbedAdminControls teams={teams} />
```

## Performance

### Optimizations
- Framer Motion layout animations
- CSS transforms for GPU acceleration
- Lazy loading for tab content
- Memoized card components

### Metrics
- Tab switch: < 300ms
- Card hover: 60fps
- Initial render: < 100ms

## Accessibility

- ✅ WCAG AA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Reduced motion support
- ✅ High contrast mode

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

```json
{
  "framer-motion": "^10.x.x"
}
```

## Testing

Run component tests:
```bash
npm test -- TabbedAdminControls.test.js
```

## Future Enhancements

- [ ] Drag and drop tab reordering
- [ ] Customizable tab visibility
- [ ] Saved tab preferences
- [ ] Search within tabs
- [ ] Bulk actions for cards
