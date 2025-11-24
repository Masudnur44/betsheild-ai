# BetShield - Gambling Behavior Monitor & Control Platform

A modern web application for monitoring and controlling gambling behavior.

## Project Structure

```
bet-guard-buddy-48937-main/
├── frontend/          # Frontend React application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
└── backend/          # Backend API server (to be created)
    └── ...
```

## Frontend

The frontend is a React + TypeScript application built with Vite.

### Getting Started (Frontend)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Frontend Features

- **Authentication**: Sign Up, Sign In, and Admin Sign In
- **Dashboard**: Overview of gambling behavior metrics
- **Spending Tracker**: Track and monitor gambling spending
- **URL Scanner**: Detect and block gambling websites
- **Alerts**: Real-time notifications
- **Achievements**: Gamification features
- **Reports**: Generate detailed reports
- **Settings**: User preferences

## Backend

The backend is an Express.js API server with TypeScript and Supabase integration.

### Getting Started (Backend)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
CORS_ORIGIN=http://localhost:5173
```

4. Run database migrations in Supabase Dashboard → SQL Editor

5. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:3001

See `backend/README.md` for detailed API documentation.

## License

Private project - All rights reserved
