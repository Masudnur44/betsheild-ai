# Complete Setup Guide for BetShield

This guide will walk you through setting up both the frontend and backend, including Supabase configuration.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- Git (optional)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: BetShield (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for the project to be created

### 1.2 Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (long string starting with `eyJ...`) ⚠️ **Keep this secret!**

### 1.3 Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file: `backend/supabase/migrations/001_create_tables.sql`
4. Copy the entire contents and paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

✅ **Supabase is now set up!**

## Step 2: Set Up Backend

### 2.1 Navigate to Backend Folder

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Create Environment File

Create a `.env` file in the `backend` folder:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

CORS_ORIGIN=http://localhost:5173
```

**Replace the placeholder values with your actual Supabase credentials from Step 1.2**

### 2.4 Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

✅ **Backend is now running!**

## Step 3: Set Up Frontend

### 3.1 Navigate to Frontend Folder

Open a **new terminal window** and:

```bash
cd frontend
```

### 3.2 Install Dependencies (if not already done)

```bash
npm install
```

### 3.3 Create Environment File (Optional)

Create a `.env.local` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note:** The `VITE_API_URL` is the most important one - it tells the frontend where to find the backend.

### 3.4 Start Frontend Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

✅ **Frontend is now running!**

## Step 4: Test the Application

1. Open http://localhost:5173 in your browser
2. You should see the BetShield login page with three tabs:
   - **Sign In**
   - **Sign Up**
   - **Admin**

### 4.1 Create Your First User

1. Click the **Sign Up** tab
2. Enter:
   - Email: `test@example.com`
   - Password: `password123` (or any password)
3. Click "Sign Up"
4. You should be redirected to the dashboard

### 4.2 Create an Admin User

To create an admin user, you need to manually set the role in Supabase:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user (the email you just signed up with)
3. Click on the user
4. Scroll down to **User Metadata**
5. Click "Edit" and add:
   ```json
   {
     "role": "admin"
   }
   ```
6. Click "Save"

Now you can sign in with the **Admin** tab using the same credentials!

## Step 5: Verify Everything Works

### Test Backend Health

Open http://localhost:3001/health in your browser. You should see:
```json
{
  "status": "ok",
  "message": "BetShield API is running"
}
```

### Test Frontend Connection

1. Sign in to the frontend
2. Go to the Dashboard
3. The dashboard should load data from the backend
4. Try adding a spending entry
5. Try scanning a URL

## Troubleshooting

### Backend won't start
- ✅ Check `.env` file exists and has correct values
- ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- ✅ Check port 3001 is not in use
- ✅ Run `npm install` again

### Frontend can't connect to backend
- ✅ Make sure backend is running on port 3001
- ✅ Check `VITE_API_URL` in frontend `.env.local`
- ✅ Check browser console for CORS errors
- ✅ Verify `CORS_ORIGIN` in backend `.env` matches frontend URL

### Database errors
- ✅ Make sure migrations were run successfully
- ✅ Check Supabase project is active
- ✅ Verify table names match
- ✅ Check RLS policies are enabled

### Authentication errors
- ✅ Check Supabase credentials are correct
- ✅ Verify token is being passed in API requests
- ✅ Check browser console for errors
- ✅ Make sure backend is running

## Project Structure

```
bet-guard-buddy-48937-main/
├── frontend/          # React frontend
│   ├── src/
│   ├── package.json
│   └── .env.local
├── backend/           # Express backend
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── supabase/
│       └── migrations/
└── README.md
```

## Next Steps

- Customize the UI and branding
- Add more features
- Deploy to production (Vercel for frontend, Railway/Render for backend)
- Set up email notifications
- Add more sophisticated gambling detection

## Need Help?

Check the browser console and backend terminal for error messages. Most issues are related to:
1. Missing environment variables
2. Supabase credentials incorrect
3. Database migrations not run
4. CORS configuration

---

**You're all set! 🎉**

