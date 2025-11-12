# Design System Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. View the Design System
```
http://localhost:3000/design-system
```
See all components, colors, typography, and examples in action.

### 2. View Component Examples
```
http://localhost:3000/component-example
```
See real-world usage patterns and best practices.

## 📦 Essential Imports

```jsx
// Page wrapper with animations
import PageTransition from '../components/PageTransition';

// Card components
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';

// Button component
import Button from '../components/Button';

// Loading states
import { SkeletonCard, SkeletonList, SkeletonText } from '../components/SkeletonLoaders';

// Toast notifications
import { useToast } from '../utils/ToastContext';
```

## 🎨 Basic Page Template

```jsx
import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import Card, { CardHeader, CardBody, CardFooter } from '../components/Card';
import Button from '../components/Button';
import { SkeletonCard } from '../components/SkeletonLoaders';
import { useToast } from '../utils/ToastContext';

const MyPage = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = () => {
    toast.success('Success!');
  };

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
            <p className="ds-body">Your content here</p>
          </CardBody>
          <CardFooter>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default MyPage;
```

## 🎯 Common Patterns

### Grid Layout
```jsx
<div className="grid">
  <div className="grid-col-12 grid-col-md-6">
    <Card>Left column</Card>
  </div>
  <div className="grid-col-12 grid-col-md-6">
    <Card>Right column</Card>
  </div>
</div>
```

### Button Variants
```jsx
<Button variant="primary">Primary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="outline">Outline</Button>
```

### Button States
```jsx
<Button loading={isSubmitting}>Submit</Button>
<Button disabled>Disabled</Button>
<Button icon="✓">With Icon</Button>
```

### Toast Notifications
```jsx
const toast = useToast();

toast.success('Operation successful!');
toast.error('An error occurred!');
toast.warning('Please check your input!');
```

### Loading States
```jsx
const [loading, setLoading] = useState(true);

if (loading) {
  return <SkeletonCard />;
}

return <ActualContent />;
```

### Typography
```jsx
<h1 className="ds-heading-1">Main Title</h1>
<h2 className="ds-heading-2">Section Title</h2>
<h3 className="ds-heading-3">Subsection</h3>
<p className="ds-body">Body text</p>
<p className="ds-body-sm">Small text</p>
```

## 🎨 Design Tokens

### Use CSS Variables
```css
/* Colors */
background: var(--ds-primary);
color: var(--ds-success);

/* Spacing */
padding: var(--ds-space-4);
margin: var(--ds-space-6);

/* Shadows */
box-shadow: var(--ds-shadow-md);

/* Border Radius */
border-radius: var(--ds-radius-md);

/* Transitions */
transition: all var(--ds-transition-base);
```

### Utility Classes
```jsx
<div className="p-md">Padding medium</div>
<div className="mt-lg">Margin top large</div>
<div className="mb-sm">Margin bottom small</div>
```

## 📱 Responsive Grid

```jsx
<div className="grid">
  {/* Full width on mobile, half on tablet, third on desktop */}
  <div className="grid-col-12 grid-col-md-6 grid-col-lg-4">
    <Card>Content</Card>
  </div>
</div>
```

## ⚡ Quick Tips

### 1. Always Wrap Pages
```jsx
<PageTransition>
  {/* Your page content */}
</PageTransition>
```

### 2. Use Cards for Content
```jsx
<Card elevated>
  <CardBody>Content</CardBody>
</Card>
```

### 3. Show Loading States
```jsx
{loading ? <SkeletonCard /> : <ActualContent />}
```

### 4. Provide User Feedback
```jsx
toast.success('Action completed!');
```

### 5. Use Typography Classes
```jsx
<h1 className="ds-heading-1">Title</h1>
<p className="ds-body">Text</p>
```

## 🔍 Component Props

### Button
```jsx
<Button
  variant="primary"      // primary, secondary, success, danger, warning, outline, ghost
  size="md"             // sm, md, lg
  loading={false}       // boolean
  disabled={false}      // boolean
  icon={<Icon />}       // React element
  onClick={handleClick} // function
>
  Button Text
</Button>
```

### Card
```jsx
<Card
  elevated={false}   // boolean - adds elevated shadow
  hoverable={true}   // boolean - adds hover effect
  onClick={handler}  // function - makes card clickable
>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Skeleton Loaders
```jsx
<SkeletonCard />
<SkeletonList items={5} />
<SkeletonText lines={3} />
<SkeletonTable rows={5} columns={4} />
<SkeletonGrid items={6} columns={3} />
```

## 🎨 Color Reference

```jsx
// Primary
--ds-primary: #667eea

// Status Colors
--ds-success: #48bb78
--ds-warning: #ed8936
--ds-danger: #f56565
--ds-info: #4299e1

// Neutrals
--ds-gray-100: #f3f4f6
--ds-gray-500: #6b7280
--ds-gray-900: #111827
```

## 📏 Spacing Scale

```jsx
--ds-space-1: 4px
--ds-space-2: 8px
--ds-space-3: 12px
--ds-space-4: 16px
--ds-space-6: 24px
--ds-space-8: 32px
--ds-space-12: 48px
--ds-space-16: 64px
```

## 🎭 Shadow Levels

```jsx
--ds-shadow-sm: 0 1px 3px rgba(0,0,0,0.1)
--ds-shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--ds-shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
--ds-shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
```

## 🔄 Common Workflows

### Creating a Form
```jsx
<Card>
  <CardHeader>
    <h3 className="ds-heading-3">Form Title</h3>
  </CardHeader>
  <CardBody>
    <div className="form-group">
      <label>Field Label</label>
      <input type="text" />
    </div>
  </CardBody>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary" loading={submitting}>
      Submit
    </Button>
  </CardFooter>
</Card>
```

### Creating a List
```jsx
<Card>
  <CardHeader>
    <h3 className="ds-heading-3">List Title</h3>
  </CardHeader>
  <CardBody>
    {loading ? (
      <SkeletonList items={5} />
    ) : (
      items.map(item => (
        <div key={item.id} className="list-item">
          {item.name}
        </div>
      ))
    )}
  </CardBody>
</Card>
```

### Creating a Dashboard
```jsx
<PageTransition>
  <div className="container">
    <h1 className="ds-heading-1">Dashboard</h1>
    
    <div className="grid">
      <div className="grid-col-12 grid-col-md-4">
        <Card elevated>
          <CardBody>Stat 1</CardBody>
        </Card>
      </div>
      <div className="grid-col-12 grid-col-md-4">
        <Card elevated>
          <CardBody>Stat 2</CardBody>
        </Card>
      </div>
      <div className="grid-col-12 grid-col-md-4">
        <Card elevated>
          <CardBody>Stat 3</CardBody>
        </Card>
      </div>
    </div>
  </div>
</PageTransition>
```

## 📚 Learn More

- **Full Guide**: `UI_UX_CONSISTENCY_GUIDE.md`
- **Implementation Details**: `UI_UX_IMPLEMENTATION_SUMMARY.md`
- **Storybook Setup**: `STORYBOOK_SETUP.md`
- **Live Examples**: `/design-system` and `/component-example`

## 🆘 Need Help?

1. Check the design system page: `/design-system`
2. View component examples: `/component-example`
3. Read the full guide: `UI_UX_CONSISTENCY_GUIDE.md`
4. Check existing component implementations

## ✅ Checklist for New Pages

- [ ] Wrap with `<PageTransition>`
- [ ] Use `<Card>` for content sections
- [ ] Use `<Button>` for all buttons
- [ ] Add loading states with skeleton loaders
- [ ] Use typography classes (`ds-heading-*`, `ds-body`)
- [ ] Use grid system for layouts
- [ ] Add toast notifications for user feedback
- [ ] Test responsive behavior
- [ ] Verify dark theme support

---

**Happy Coding! 🎉**
