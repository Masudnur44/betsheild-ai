# Quick Start Guide

## 🚀 Get Everything Running in 5 Minutes

### Step 1: Set Up Supabase (2 minutes)

1. Go to https://app.supabase.com and create a free account
2. Create a new project
3. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep secret!)
4. Go to **SQL Editor** and run the migration from `backend/supabase/migrations/001_create_tables.sql`

### Step 2: Backend Setup (1 minute)

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3001
SUPABASE_URL=your_url_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
SUPABASE_ANON_KEY=your_key_here
CORS_ORIGIN=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### Step 3: Frontend Setup (1 minute)

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:3001/api
```

Start frontend:
```bash
npm run dev
```

### Step 4: Test It! (1 minute)

1. Open http://localhost:5173
2. Click **Sign Up** tab
3. Create an account
4. You're in! 🎉

---

**For detailed instructions, see `SETUP_GUIDE.md`**
