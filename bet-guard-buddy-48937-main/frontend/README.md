# BetShield Frontend

React + TypeScript frontend application for BetShield.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (optional, for Supabase):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173

## Authentication

The app now includes three authentication options:
- **Sign In**: Regular user sign in
- **Sign Up**: Create a new account
- **Admin Sign In**: Admin panel access

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- Supabase (for authentication)

