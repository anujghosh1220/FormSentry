# FormSentry

A production-quality visual form builder and validation playground built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Manage all your forms in one place
- **Visual Form Builder**: Three-panel editor with field library, canvas, and properties inspector
- **Form Templates**: Pre-built Contact Us, Registration, and Feedback templates
- **Validation Engine**: Comprehensive validation for all field types (required, email, length, numeric, date, etc.)
- **Preview & Test**: Test forms as end users would see them
- **Persistence**: Save forms in localStorage (works offline)
- **Import/Export**: Share forms as JSON
- **Responsive Design**: Works on desktop, tablet, and mobile
- **TypeScript**: Fully typed for safety and maintainability

## Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Lucide React
- Vitest & React Testing Library
- localStorage for persistence

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Test

```bash
npm run test
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## Architecture

- `src/components/` - Reusable UI components
- `src/pages/` - Page components (Dashboard, Builder, Preview)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (validation, etc.)
- `src/lib/` - Core libraries (storage, ID generation)
- `src/constants/` - Constants and templates
- `src/hooks/` - Custom React hooks

## Data Persistence & Privacy

Forms are stored locally in your browser using localStorage. No data is sent to external servers. This means:
- Forms are only available on the device/browser where they were created
- Clearing browser data will remove saved forms
- No account or authentication required

## Import/Export

- Export: Download form configuration as JSON from Dashboard or Builder
- Import: Load form from JSON file (creates a copy to avoid overwriting)

## Validation Behavior

- Required fields: Must have a value (checkboxes must be checked)
- Email: Valid email format required
- Text/Textarea/Password: Min/max length enforcement
- Number: Numeric validation with min/max bounds
- Select/Radio: Must select a valid option
- Date: Date range validation when configured
- Optional fields: Empty values pass validation unless other rules apply

## Known Limitations

- Forms are stored locally only (not synced across devices)
- No form submission backend (submissions are validated client-side only)
- Limited undo/redo functionality

## Deployment

This app can be deployed for free on:
- [Vercel](https://vercel.com/) - Connect repo and deploy
- [Netlify](https://www.netlify.com/) - Drag and drop `dist/` folder
- [GitHub Pages](https://pages.github.com/) - Static hosting

Build with `npm run build` and deploy the `dist/` directory.

