# Troubleshooting "Failed to Fetch" Error

## Problem
You're seeing "failed to fetch" errors in the browser console or when trying to use the app.

## Solution

### Step 1: Check if Backend is Running

The backend server needs to be running on port 3001. Check if it's running:

**Windows PowerShell:**
```powershell
netstat -ano | findstr :3001
```

If you see nothing, the backend is NOT running.

### Step 2: Start the Backend Server

1. Open a **new terminal window**
2. Navigate to the backend folder:
```bash
cd backend
```

3. Make sure you have a `.env` file with your Supabase credentials

4. Start the server:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

### Step 3: Verify Backend is Working

Open http://localhost:3001/health in your browser. You should see:
```json
{
  "status": "ok",
  "message": "BetShield API is running"
}
```

### Step 4: Check Frontend Configuration

Make sure your frontend has the correct API URL. Create or check `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
```

### Step 5: Restart Frontend

After starting the backend:
1. Stop the frontend (Ctrl+C)
2. Restart it:
```bash
cd frontend
npm run dev
```

## Common Issues

### Backend won't start
- ✅ Check if `.env` file exists in `backend/` folder
- ✅ Verify all Supabase credentials are correct
- ✅ Make sure port 3001 is not in use by another app
- ✅ Run `npm install` in the backend folder

### CORS errors
- ✅ Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- ✅ Make sure backend `.env` has: `CORS_ORIGIN=http://localhost:5173`

### Still getting errors?
1. Check browser console (F12) for specific error messages
2. Check backend terminal for error messages
3. Verify both servers are running:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/health

