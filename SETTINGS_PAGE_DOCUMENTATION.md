# Settings Page - Documentation

## Overview
The Settings page provides a comprehensive interface for configuring application behavior, event parameters, and security restrictions. The page has been redesigned with a modern tabbed interface and integrated toast notifications.

## Critical Bug Fix

### Issue
The Settings component had a runtime error caused by calling `applySecuritySettings()` in a `useEffect` hook before the function was defined using `useCallback`. This created a reference error that prevented the page from rendering.

### Solution
1. **Removed duplicate security logic** - The `applySecuritySettings` function and related event handlers were removed from the Settings component
2. **Leveraged GlobalSecurity component** - Security settings are now exclusively managed by the `GlobalSecurity` component, which is already mounted at the app level
3. **Eliminated circular dependencies** - Removed unnecessary dependencies between Settings component and security utilities

### Code Changes
- Removed `applySecuritySettings`, `handleKeyDown`, `handleContextMenu`, and `handleBeforeUnload` functions
- Removed the problematic `useEffect` hook that called `applySecuritySettings`
- Simplified component to focus on UI and settings management only

## Architecture

### Component Structure
```
Settings Component
├── Toast Integration (useToast hook)
├── Settings Context (useSettings hook)
├── Three Main Tabs
│   ├── General Settings
│   ├── Event Settings
│   └── Security Settings
└── Action Buttons (Save & Reset)
```

### Dependencies
- `SettingsContext` - Manages global settings state
- `ToastContext` - Provides toast notifications
- `GlobalSecurity` - Handles security enforcement (separate component)

## Features

### 1. Tabbed Navigation
Three main tabs organize settings into logical groups:

#### General Settings Tab 🎯
- Application name configuration
- Display preferences (header, titles, progress bar, page numbers, logo)
- Layout options (question layout, navigation bar position)

#### Event Settings Tab ⏰
- Global time limits
- Individual question time limits
- Event scheduling (start/end dates)
- Quiz attempts configuration
- Question randomization
- Auto-numbering
- Questions per page

#### Security Settings Tab 🔒
- Browser restrictions (cut, copy, paste, right-click, print)
- Navigation controls
- Browser attempt tracking
- Confirmation dialogs (submit, browser close)

### 2. Toast Notifications
Integrated toast system provides user feedback:
- **Success** - Settings saved successfully
- **Error** - Save failures with error details
- **Warning** - Unsaved changes notification

### 3. Live Preview
Settings changes are immediately reflected in the form state, allowing users to preview their configuration before saving.

### 4. Unsaved Changes Tracking
The component tracks when settings have been modified and warns users before resetting.

## User Interface

### Layout
- **Sidebar Navigation** - Sticky menu with tab options
- **Main Content Area** - Dynamic content based on selected tab
- **Action Bar** - Save and Reset buttons at the bottom

### Styling
- Modern gradient design with purple/blue theme
- Responsive layout (mobile-friendly)
- Smooth animations and transitions
- Clear visual hierarchy
- Accessible form controls

### CSS Classes
- `.settings-container` - Main wrapper
- `.settings-sidebar` - Left navigation panel
- `.settings-content` - Right content area
- `.settings-tab` - Individual tab buttons
- `.settings-tab.active` - Active tab styling
- `.form-group` - Form field wrapper
- `.checkbox-label` - Checkbox with label
- `.settings-actions` - Action button container

## API Integration

### Endpoints Used
- `GET /api/settings` - Fetch current settings
- `POST /api/settings` - Save settings

### Data Flow
1. Component mounts → SettingsContext fetches settings from API
2. User modifies settings → Local state updates
3. User clicks Save → API call to persist changes
4. Success/Error → Toast notification displayed

## Testing

### Test Coverage
The Settings component includes comprehensive unit tests:

1. **Rendering Tests**
   - Component renders without crashing
   - All tabs are displayed
   - Form elements are present

2. **Interaction Tests**
   - Tab switching functionality
   - Input field changes
   - Checkbox toggles
   - Save button click
   - Reset button click

3. **Integration Tests**
   - API calls on save
   - Toast notifications
   - Conditional rendering (time limits, schedules)

### Running Tests
```bash
cd frontend
npm test Settings.test.js
```

## Accessibility

### Features
- Semantic HTML structure
- Proper label associations
- Keyboard navigation support
- Focus management
- ARIA labels where appropriate
- Screen reader friendly

### Best Practices
- All form inputs have associated labels
- Buttons have descriptive text
- Color is not the only indicator of state
- Sufficient color contrast ratios

## Responsive Design

### Breakpoints
- **Desktop** (>768px) - Side-by-side layout with sticky sidebar
- **Mobile** (≤768px) - Stacked layout with horizontal tab scrolling

### Mobile Optimizations
- Touch-friendly tap targets
- Simplified navigation
- Optimized spacing
- Readable font sizes

## Security Considerations

### Settings Enforcement
Security settings are enforced by the `GlobalSecurity` component:
- Keyboard event blocking (cut, copy, paste, print)
- Context menu prevention (right-click)
- Browser close warnings
- Settings are applied globally across the application

### Validation
- Input validation for numeric fields (min/max values)
- Type checking for all settings
- Safe defaults if API fails

## Performance

### Optimizations
- Minimal re-renders using controlled components
- Efficient state updates
- Lazy loading of tab content
- CSS animations for smooth transitions

### Bundle Size
- Lightweight component (~15KB)
- Shared dependencies with other components
- No heavy external libraries

## Future Enhancements

### Potential Improvements
1. **Settings Import/Export** - Allow users to backup and restore settings
2. **Settings Templates** - Pre-configured setting profiles
3. **Real-time Preview** - Live preview of UI changes
4. **Settings History** - Track and revert to previous configurations
5. **Bulk Operations** - Apply settings to multiple quizzes at once
6. **Advanced Validation** - More sophisticated input validation
7. **Settings Search** - Search functionality for finding specific settings

## Troubleshooting

### Common Issues

#### Settings Not Saving
- Check browser console for API errors
- Verify backend is running
- Check authentication token validity
- Ensure MongoDB connection is active

#### Toast Notifications Not Appearing
- Verify ToastProvider is wrapping the component in App.js
- Check for JavaScript errors in console
- Ensure framer-motion is installed

#### Security Settings Not Working
- Verify GlobalSecurity component is mounted
- Check browser console for event listener errors
- Test in different browsers (some may block certain restrictions)

#### Layout Issues on Mobile
- Clear browser cache
- Check viewport meta tag
- Verify CSS is loading correctly

## Code Examples

### Adding a New Setting

1. **Add to SettingsContext default state:**
```javascript
const [settings, setSettings] = useState({
  // ... existing settings
  newSetting: false
});
```

2. **Add to Settings component:**
```javascript
<div className="form-group">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={settings.newSetting}
      onChange={(e) => handleChange('newSetting', e.target.checked)}
    />
    New Setting Label
  </label>
  <small>Description of what this setting does</small>
</div>
```

3. **Update backend model** (if needed):
```javascript
// backend/src/models/Settings.js
newSetting: { type: Boolean, default: false }
```

### Custom Validation Example
```javascript
const handleChange = (field, value) => {
  // Add custom validation
  if (field === 'timeLimit' && value < 1) {
    error('Time limit must be at least 1 minute');
    return;
  }
  
  setSettings({ ...settings, [field]: value });
  setHasUnsavedChanges(true);
};
```

## Maintenance

### Regular Tasks
- Review and update default settings
- Test security restrictions in new browser versions
- Update documentation for new settings
- Monitor API performance
- Review user feedback

### Version History
- **v2.0** - Complete redesign with tabbed interface and toast notifications
- **v1.1** - Bug fix for applySecuritySettings error
- **v1.0** - Initial release with basic settings management

## Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Review backend logs
5. Contact development team

## License
MIT License - See project root for details
