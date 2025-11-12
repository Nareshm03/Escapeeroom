# UI/UX Consistency Implementation Guide

## Overview
This document outlines the comprehensive UI/UX consistency system implemented across the Escape Room Team Management App.

## 1. Layout System

### 12-Column Responsive Grid
- **Implementation**: `frontend/src/styles/grid.css`
- **Base gutter width**: 16px
- **Spacing scale**: 8px base (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- **Breakpoints**:
  - Desktop: > 1200px
  - Tablet: 768px - 1200px
  - Mobile: < 768px
  - Small Mobile: < 576px

### Usage
```jsx
<div className="grid">
  <div className="grid-col-12">Full width</div>
  <div className="grid-col-6">Half width</div>
  <div className="grid-col-4">One third</div>
</div>
```

### Responsive Classes
- `grid-col-md-{1-12}` - Tablet breakpoint
- `grid-col-sm-{1-12}` - Mobile breakpoint
- `grid-col-xs-{1-12}` - Small mobile breakpoint

## 2. Visual Design Elements

### Card System
- **Component**: `frontend/src/components/Card.js`
- **Border radius**: 8px
- **Base shadow**: `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Elevated shadow**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **Hover shadow**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

### Usage
```jsx
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';

<Card elevated hoverable>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>Card content</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## 3. Typography Hierarchy

### Design Tokens
- **Font Family**: 'Inter', sans-serif
- **Heading 1**: 36px (2.25rem), Bold (700)
- **Heading 2**: 30px (1.875rem), Semibold (600)
- **Heading 3**: 24px (1.5rem), Semibold (600)
- **Heading 4**: 20px (1.25rem), Medium (500)
- **Body**: 16px (1rem), Normal (400)
- **Small Body**: 14px (0.875rem), Normal (400)

### Usage
```jsx
<h1 className="ds-heading-1">Main Title</h1>
<h2 className="ds-heading-2">Section Title</h2>
<h3 className="ds-heading-3">Subsection Title</h3>
<p className="ds-body">Body text</p>
<p className="ds-body-sm">Small text</p>
```

## 4. Animation System (Framer Motion)

### Page Transitions
- **Component**: `frontend/src/components/PageTransition.js`
- **Duration**: 300ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Initial state**: opacity: 0, y: 20
- **Animate state**: opacity: 1, y: 0

### Usage
```jsx
import PageTransition from '../components/PageTransition';

<PageTransition>
  <YourPageContent />
</PageTransition>
```

### Button Animations
- **Hover**: scale: 1.02
- **Tap**: scale: 0.98
- **Duration**: 150ms

## 5. User Feedback System

### Toast Notifications
- **Component**: `frontend/src/components/Toast.js`
- **Context**: `frontend/src/utils/ToastContext.js`
- **Position**: Bottom-right (via CSS)
- **Animation**: Fade in/out with slide
- **Auto-dismiss**: 5 seconds (configurable)
- **Types**: success, error, warning

### Usage
```jsx
import { useToast } from '../utils/ToastContext';

const MyComponent = () => {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };
  
  const handleError = () => {
    toast.error('An error occurred!', 0); // 0 = no auto-dismiss
  };
  
  const handleWarning = () => {
    toast.warning('Please check your input!', 3000); // Custom duration
  };
};
```

## 6. Error Handling

### Global Error Boundary
- **Component**: `frontend/src/components/ErrorBoundary.js`
- **Features**:
  - Catches all unhandled React errors
  - Displays user-friendly error message
  - Provides recovery options (Refresh, Go to Dashboard)
  - Shows error details in development mode
  - Logs errors to console (ready for monitoring service integration)

### Implementation
Already wrapped around the entire app in `App.js`. No additional setup needed.

### Error Logging Integration
To integrate with monitoring services (Sentry, CloudWatch, etc.):
```javascript
// In ErrorBoundary.js componentDidCatch method
if (process.env.NODE_ENV === 'production') {
  // Example: Sentry.captureException(error);
  // Example: logToCloudWatch(error, errorInfo);
}
```

## 7. Loading States

### Skeleton Loaders
- **Component**: `frontend/src/components/SkeletonLoaders.js`
- **Animation**: Shimmer effect (1.5s duration)
- **Types**: Card, List, Image, Text, Table, Grid

### Usage
```jsx
import { 
  SkeletonCard, 
  SkeletonList, 
  SkeletonText,
  SkeletonTable,
  SkeletonGrid 
} from '../components/SkeletonLoaders';

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <SkeletonCard />;
  }
  
  return <ActualContent />;
};
```

### Button Loading State
```jsx
<Button loading variant="primary">
  Submit
</Button>
```

## 8. Design System Components

### Button Component
- **Component**: `frontend/src/components/Button.js`
- **Variants**: primary, secondary, success, danger, warning, outline, ghost
- **Sizes**: sm, md, lg
- **States**: default, hover, disabled, loading

### Usage
```jsx
import Button from '../components/Button';

<Button variant="primary" size="md">Click Me</Button>
<Button variant="success" loading>Submitting...</Button>
<Button variant="danger" disabled>Disabled</Button>
<Button variant="outline" icon={<Icon />}>With Icon</Button>
```

## 9. Design Tokens (CSS Variables)

### Colors
```css
--ds-primary: #667eea
--ds-success: #48bb78
--ds-warning: #ed8936
--ds-danger: #f56565
--ds-info: #4299e1
```

### Spacing (8px scale)
```css
--ds-space-1: 4px
--ds-space-2: 8px
--ds-space-4: 16px
--ds-space-6: 24px
--ds-space-8: 32px
--ds-space-12: 48px
--ds-space-16: 64px
```

### Shadows
```css
--ds-shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
--ds-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--ds-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--ds-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

### Border Radius
```css
--ds-radius-sm: 4px
--ds-radius-md: 8px
--ds-radius-lg: 12px
--ds-radius-xl: 16px
--ds-radius-2xl: 24px
```

### Transitions
```css
--ds-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--ds-transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1)
--ds-transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

## 10. Design System Documentation Page

### Access
Navigate to `/design-system` in the application to view the live design system documentation.

### Features
- Color token showcase
- Typography hierarchy examples
- Spacing scale visualization
- Shadow elevation levels
- Button variants and states
- Card component examples
- Skeleton loader demos
- Toast notification triggers
- Grid system demonstration

## 11. Best Practices

### Consistency Checklist
- ✅ Use design tokens (CSS variables) instead of hardcoded values
- ✅ Apply PageTransition wrapper to all page components
- ✅ Use Card component for content containers
- ✅ Use Button component for all interactive buttons
- ✅ Show skeleton loaders during data fetching
- ✅ Use toast notifications for user feedback
- ✅ Follow typography hierarchy for headings
- ✅ Use grid system for layouts
- ✅ Apply consistent spacing using utility classes

### Component Structure
```jsx
import PageTransition from '../components/PageTransition';
import Card, { CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import { SkeletonCard } from '../components/SkeletonLoaders';
import { useToast } from '../utils/ToastContext';

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  if (loading) {
    return (
      <PageTransition>
        <div className="container">
          <SkeletonCard />
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container">
        <h1 className="ds-heading-1">Page Title</h1>
        
        <Card elevated>
          <CardHeader>
            <h2 className="ds-heading-3">Section Title</h2>
          </CardHeader>
          <CardBody>
            <p className="ds-body">Content here</p>
            <Button 
              variant="primary" 
              onClick={() => toast.success('Success!')}
            >
              Submit
            </Button>
          </CardBody>
        </Card>
      </div>
    </PageTransition>
  );
};
```

## 12. Dark Theme Support

All components support dark theme automatically through CSS variables defined in `styles/themes.css`.

### Theme Toggle
The ThemeToggle component is already integrated in the app. Users can switch between light and dark themes.

## 13. Accessibility

### Features
- Semantic HTML elements
- ARIA labels and roles
- Focus visible states
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion support

### Focus States
All interactive elements have consistent focus rings:
```css
outline: 2px solid #667eea;
outline-offset: 2px;
box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
```

## 14. Responsive Design

### Mobile-First Approach
All components are designed mobile-first and scale up to larger screens.

### Touch Targets
Minimum touch target size: 48x48px on mobile devices.

### Breakpoint Strategy
- Mobile: Single column layouts
- Tablet: 2-3 column layouts
- Desktop: Full grid system (up to 12 columns)

## 15. File Structure

```
frontend/src/
├── components/
│   ├── Button.js & Button.css
│   ├── Card.js & Card.css
│   ├── ErrorBoundary.js
│   ├── PageTransition.js
│   ├── SkeletonLoaders.js & SkeletonLoaders.css
│   └── Toast.js (existing)
├── pages/
│   ├── DesignSystem.js & DesignSystem.css
│   └── [other pages]
├── styles/
│   ├── design-system.css (NEW - Core tokens)
│   ├── grid.css (existing)
│   ├── themes.css (existing)
│   └── [other styles]
└── utils/
    └── ToastContext.js (existing)
```

## 16. Migration Guide

### Updating Existing Pages

1. **Wrap with PageTransition**:
```jsx
import PageTransition from '../components/PageTransition';

return (
  <PageTransition>
    {/* existing content */}
  </PageTransition>
);
```

2. **Replace div cards with Card component**:
```jsx
// Before
<div className="card">
  <h2>Title</h2>
  <p>Content</p>
</div>

// After
<Card>
  <CardHeader>
    <h2 className="ds-heading-3">Title</h2>
  </CardHeader>
  <CardBody>
    <p className="ds-body">Content</p>
  </CardBody>
</Card>
```

3. **Replace buttons with Button component**:
```jsx
// Before
<button className="btn btn-primary">Click</button>

// After
<Button variant="primary">Click</Button>
```

4. **Add loading states**:
```jsx
const [loading, setLoading] = useState(true);

if (loading) {
  return <SkeletonCard />;
}
```

## 17. Testing

### Visual Regression Testing
To implement visual regression testing:
1. Install testing tools (e.g., Percy, Chromatic)
2. Create snapshots of all design system components
3. Run tests on each PR to detect visual changes

### Component Testing
All shared components should have corresponding test files following the pattern:
- `Button.test.js`
- `Card.test.js`
- `SkeletonLoaders.test.js`

## 18. Maintenance

### Adding New Components
1. Create component in `components/` directory
2. Follow existing patterns (props, styling, animations)
3. Add to design system documentation page
4. Create tests
5. Update this guide

### Updating Design Tokens
1. Modify values in `styles/design-system.css`
2. Changes propagate automatically to all components
3. Test across all pages
4. Update documentation

## 19. Performance Considerations

- Framer Motion animations use GPU acceleration
- Skeleton loaders prevent layout shift
- CSS variables enable efficient theme switching
- Minimal re-renders with proper React patterns

## 20. Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

---

## Quick Reference

### Import Statements
```jsx
// Components
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';
import Button from '../components/Button';
import PageTransition from '../components/PageTransition';
import { SkeletonCard, SkeletonList } from '../components/SkeletonLoaders';

// Hooks
import { useToast } from '../utils/ToastContext';
```

### Common Patterns
```jsx
// Page structure
<PageTransition>
  <div className="container">
    <h1 className="ds-heading-1">Title</h1>
    <Card>
      <CardBody>Content</CardBody>
    </Card>
  </div>
</PageTransition>

// Grid layout
<div className="grid">
  <div className="grid-col-6">Left</div>
  <div className="grid-col-6">Right</div>
</div>

// Button with loading
<Button variant="primary" loading={isSubmitting}>
  Submit
</Button>

// Toast notification
toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
```

---

**Last Updated**: 2024
**Version**: 1.0.0
