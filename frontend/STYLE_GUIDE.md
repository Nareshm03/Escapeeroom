# Admin Dashboard Style Guide

This guide documents the layout, spacing, typography, and component specifications for the Admin Dashboard redesign.

## Grid System
- 12-column grid: `grid-template-columns: repeat(12, 1fr)`.
- Gutters: `16px` horizontal and vertical (`column-gap`, `row-gap`).
- Responsive breakpoints:
  - ≤1200px: 8 columns.
  - ≤900px: 4 columns.
  - ≤600px: 1 column.
- Utilities:
  - Container: `.grid-12`.
  - Column spans: `.col-span-1` … `.col-span-12`.

## Spacing Scale (8px)
- Variables: `--space-4`, `--space-8`, `--space-12`, `--space-16`, `--space-24`, `--space-32`.
- Utilities used:
  - Margin: `.mb-8`, `.mb-16`, `.mb-24`, `.mb-32`, `.mt-8`, `.mt-16`, `.mt-24`, `.mt-32`.
  - Padding: `.p-8`, `.p-16`, `.p-24`, `.p-32`.

## Typography
- Font: Inter (system fallbacks).
- Hierarchy:
  - H1: `2rem`, weight `800` (dashboard header).
  - H2: `1.5rem`, weight `600` (section titles).
  - H3: `1.25rem`, weight `600`.
  - Body: `14–16px`, color `#64748b` for secondary text.
- Utilities:
  - `.section-title` for section headings.
  - `.dashboard-header` for header layout.

## Cards
- Base class: `.card` (existing), with soft shadow and rounded corners.
- Stat grouping: `.stat-card` uses vertical layout and 8px gap.
- Visuals: subtle borders and gradient accents for brand consistency.

## Sections
- Header: "Welcome back, Admin!" with supportive subtitle.
- Stats: four cards (Total Teams, Active Games, Completed, Avg Score).
- Quick Actions: shortcuts to Teams, Create Quiz, Quiz List, Settings.
- Admin Controls: Admin Panel, Build Quiz, App Settings.
- Teams table: preserved functionality, accessible table with `<caption>`.

## Accessibility
- Links include `aria-label` with descriptive titles.
- Tables include `<caption>` and clear header semantics.
- Color contrast aligned with existing palette; avoid using color alone to convey meaning.
- Focus states inherit from browser defaults; no focus suppression.

## Responsiveness
- Grid adapts at breakpoints; cards and actions stack on smaller screens.
- Avoid fixed widths; use grid spans and flexible containers.

## Brand and Color
- Use existing CSS variables from `index.css` (`--primary`, `--secondary`, `--accent`, grayscale tokens).
- Maintain neutral backgrounds and gradient accents already used across the app.

## Implementation Notes
- Grid and spacing utilities live in `src/styles/grid.css` and are imported in `index.css`.
- The Admin Dashboard uses these utilities to ensure consistent layout and spacing without overriding base card styles.