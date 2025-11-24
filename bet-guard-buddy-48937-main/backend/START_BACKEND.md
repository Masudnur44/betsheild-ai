# How to Start the Backend Server

## Quick Start

1. **Open a new terminal window**

2. **Navigate to backend folder:**
```bash
cd backend
```

3. **Install dependencies (if not done):**
```bash
npm install
```

4. **Create `.env` file:**
Create a file named `.env` in the `backend` folder with this content:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

CORS_ORIGIN=http://localhost:5173
```

**Replace the placeholder values with your actual Supabase credentials.**

5. **Start the server:**
```bash
npm run dev
```

6. **You should see:**
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

7. **Test it:**
Open http://localhost:3001/health in your browser. You should see:
```json
{"status":"ok","message":"BetShield API is running"}
```

## If You Don't Have Supabase Set Up Yet

You can still start the backend with placeholder values, but some features won't work:

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_SERVICE_ROLE_KEY=placeholder-key
SUPABASE_ANON_KEY=placeholder-key
CORS_ORIGIN=http://localhost:5173
```

The server will start, but authentication won't work until you configure real Supabase credentials.

## Keep This Terminal Open!

The backend server needs to keep running. Don't close this terminal window while using the app.

