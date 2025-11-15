# HD Signals Web Application

This is the frontend web application for the HD Signals n8n automation project. It provides a landing page and subscription management interface.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the web directory:

   ```bash
   cd web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Landing Page**: Explains the n8n automation workflow and value proposition
- **Subscription Management**: Users can subscribe with email and select 1-5 stocks
- **Stock Selection**: Multi-select dropdown with stock icons from Clearbit
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Local Storage**: Subscriptions are saved locally (extensible to backend API)

## Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── subscribe/         # Subscription page
│   └── globals.css        # Global styles and theme
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── features/          # Feature components
│   └── layout/            # Layout components
├── lib/                   # Utilities and helpers
│   ├── constants.ts      # Stock list and workflow steps
│   ├── storage.ts         # Storage abstraction layer
│   ├── utils.ts           # Utility functions
│   └── validation.ts      # Zod schemas
└── types/                 # TypeScript type definitions
```

## Technology Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** with custom theme
- **shadcn/ui** components
- **React Hook Form** for form handling
- **Zod** for validation

## Building for Production

```bash
npm run build
npm start
```

## Extensibility

The codebase is structured to easily add new features:

- **Storage Layer**: `lib/storage.ts` can be swapped for API calls
- **Component Structure**: New features can be added as components in `components/features/`
- **Routing**: Additional pages can be added in `app/` directory

## Notes

- Stock icons are loaded from Clearbit logo service
- Subscriptions are stored in browser localStorage
- The design uses the custom color theme defined in `globals.css`
