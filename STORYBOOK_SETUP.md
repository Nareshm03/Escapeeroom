# Storybook Setup Guide

## Overview
Storybook is a development environment for UI components. It allows you to browse a component library, view different states of each component, and interactively develop and test components.

## Installation

### 1. Install Storybook
```bash
cd frontend
npx storybook@latest init
```

This will:
- Install Storybook dependencies
- Create `.storybook` configuration folder
- Add Storybook scripts to package.json
- Create example stories

### 2. Configure Storybook for the Project

Update `.storybook/main.js`:
```javascript
module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app'
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5'
  }
};
```

### 3. Configure Preview

Update `.storybook/preview.js`:
```javascript
import '../src/index.css';
import '../src/styles/design-system.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#ffffff',
      },
      {
        name: 'dark',
        value: '#1f2937',
      },
    ],
  },
};
```

## Running Storybook

```bash
cd frontend
npm run storybook
```

This will start Storybook on `http://localhost:6006`

## Existing Stories

The following component stories are already created:

### 1. Button Component
- **File**: `src/components/Button.stories.js`
- **Stories**:
  - Primary, Secondary, Success, Danger, Warning
  - Outline, Ghost
  - Small, Medium, Large sizes
  - Disabled, Loading states
  - With Icon
  - All Variants showcase

### 2. Card Component
- **File**: `src/components/Card.stories.js`
- **Stories**:
  - Basic Card
  - Elevated Card
  - Hoverable Card
  - Card with Footer
  - Complete Example
  - Card Grid

### 3. StatCard Component (Existing)
- **File**: `src/components/StatCard.stories.js`
- Already configured

### 4. EnhancedNavbar Component (Existing)
- **File**: `src/components/EnhancedNavbar.stories.js`
- Already configured

### 5. InteractiveTile Component (Existing)
- **File**: `src/components/InteractiveTile.stories.js`
- Already configured

### 6. EnhancedStatCard Component (Existing)
- **File**: `src/stories/EnhancedStatCard.stories.js`
- Already configured

## Creating New Stories

### Template for New Component Stories

```javascript
import React from 'react';
import YourComponent from './YourComponent';

export default {
  title: 'Design System/YourComponent',
  component: YourComponent,
  argTypes: {
    // Define controls for props
    variant: {
      control: 'select',
      options: ['primary', 'secondary']
    },
    disabled: { control: 'boolean' }
  }
};

const Template = (args) => <YourComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Default props
};

export const Variant = Template.bind({});
Variant.args = {
  // Variant props
};
```

## Visual Regression Testing with Chromatic

### 1. Install Chromatic
```bash
cd frontend
npm install --save-dev chromatic
```

### 2. Setup Chromatic
```bash
npx chromatic --project-token=<your-project-token>
```

### 3. Add to CI/CD
Add to `.github/workflows/chromatic.yml`:
```yaml
name: Chromatic

on: push

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: cd frontend && npm ci
      - run: cd frontend && npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## Best Practices

### 1. Story Organization
- Group stories by category: `Design System/`, `Components/`, `Pages/`
- Use consistent naming: `ComponentName.stories.js`
- Include multiple variants per component

### 2. Story Content
- Show all possible states (default, hover, disabled, loading)
- Include edge cases (long text, empty state)
- Demonstrate responsive behavior
- Add documentation using MDX

### 3. Controls
- Add controls for all interactive props
- Use appropriate control types (select, boolean, text, number)
- Set sensible default values

### 4. Documentation
- Add descriptions to stories
- Include usage examples
- Document prop types and requirements

## Component Stories Checklist

When creating stories for a new component:

- [ ] Create `ComponentName.stories.js` file
- [ ] Add default export with title and component
- [ ] Define argTypes for all props
- [ ] Create Template function
- [ ] Add Default story
- [ ] Add stories for all variants
- [ ] Add stories for all states (disabled, loading, error)
- [ ] Add stories for different sizes
- [ ] Add showcase story with all variants
- [ ] Test in Storybook
- [ ] Add to visual regression tests

## Recommended Addons

### Essential Addons (Already Included)
- `@storybook/addon-essentials` - Controls, Actions, Docs, Viewport
- `@storybook/addon-links` - Link between stories
- `@storybook/addon-interactions` - Test user interactions

### Additional Addons to Consider
```bash
npm install --save-dev @storybook/addon-a11y
npm install --save-dev @storybook/addon-viewport
npm install --save-dev @storybook/addon-backgrounds
```

Update `.storybook/main.js`:
```javascript
addons: [
  '@storybook/addon-links',
  '@storybook/addon-essentials',
  '@storybook/addon-interactions',
  '@storybook/addon-a11y',
  '@storybook/preset-create-react-app'
]
```

## Accessibility Testing

With `@storybook/addon-a11y`:
```javascript
import { withA11y } from '@storybook/addon-a11y';

export default {
  title: 'Design System/Button',
  component: Button,
  decorators: [withA11y]
};
```

## Building Storybook for Production

```bash
cd frontend
npm run build-storybook
```

This creates a static build in `storybook-static/` that can be deployed.

## Deployment Options

### 1. Chromatic (Recommended)
- Automatic deployment on push
- Visual regression testing
- Review UI changes in PRs

### 2. Netlify/Vercel
```bash
# Build command
npm run build-storybook

# Publish directory
storybook-static
```

### 3. GitHub Pages
Add to `package.json`:
```json
{
  "scripts": {
    "deploy-storybook": "storybook-to-ghpages"
  }
}
```

## Troubleshooting

### Issue: Styles not loading
**Solution**: Import CSS files in `.storybook/preview.js`

### Issue: Components not found
**Solution**: Check story paths in `.storybook/main.js`

### Issue: Build errors
**Solution**: Ensure all dependencies are installed and compatible

## Resources

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Component Story Format](https://storybook.js.org/docs/react/api/csf)
- [Storybook Addons](https://storybook.js.org/addons)

## Next Steps

1. Install Storybook: `npx storybook@latest init`
2. Run Storybook: `npm run storybook`
3. View existing stories at `http://localhost:6006`
4. Create stories for remaining components
5. Set up Chromatic for visual regression testing
6. Integrate into CI/CD pipeline
7. Deploy Storybook to production

---

**Note**: All component stories are already created and ready to use once Storybook is installed.
