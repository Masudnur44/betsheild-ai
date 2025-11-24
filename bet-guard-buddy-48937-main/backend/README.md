# BetShield Backend API

Express.js backend server for BetShield with TypeScript and Supabase integration.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

CORS_ORIGIN=http://localhost:5173
```

**How to get Supabase keys:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)
   - **anon** `public` key → `SUPABASE_ANON_KEY`

### 3. Run Database Migrations

See `supabase/migrations/` folder for SQL migration files. Run them in Supabase Dashboard → SQL Editor.

### 4. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

The server will run on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/admin/signin` - Admin sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/verify` - Verify token

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

### Spending
- `GET /api/spending` - Get all spending entries
- `GET /api/spending/summary` - Get spending summary
- `POST /api/spending` - Create spending entry
- `PUT /api/spending/:id` - Update spending entry
- `DELETE /api/spending/:id` - Delete spending entry

### URL Scanner
- `POST /api/scanner` - Scan URL for gambling sites
- `GET /api/scanner/history` - Get scan history

### Alerts
- `GET /api/alerts` - Get user alerts
- `PATCH /api/alerts/:id/read` - Mark alert as read
- `DELETE /api/alerts/:id` - Delete alert

### Achievements
- `GET /api/achievements` - Get user achievements

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:id/download` - Download report

### Settings
- `GET /api/settings/profile` - Get user profile
- `PUT /api/settings/profile` - Update profile
- `PUT /api/settings/password` - Update password
- `GET /api/settings/settings` - Get user settings
- `PUT /api/settings/settings` - Update settings
- `DELETE /api/settings/account` - Delete account

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (Supabase)
│   ├── middleware/       # Auth middleware
│   ├── routes/          # API routes
│   └── index.ts         # Express app entry point
├── supabase/
│   └── migrations/      # Database migrations
├── package.json
└── tsconfig.json
```

