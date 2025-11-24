# How to Start the Development Server

## Option 1: Run in Terminal (Recommended)
Open a terminal in the `bet-guard-buddy-48937-main` folder and run:

```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Then open http://localhost:5173 in your browser.

## Option 2: Check if Server is Already Running
If you see "port already in use" error, the server might already be running.
Just open http://localhost:5173 in your browser.

## Common Issues:

1. **Port 5173 already in use**: 
   - Kill the process: `netstat -ano | findstr :5173` then `taskkill /PID <PID> /F`
   - Or change port in `vite.config.ts`

2. **Page shows blank/error**:
   - Check browser console (F12) for errors
   - Make sure all dependencies are installed: `npm install`

3. **Can't connect**:
   - Try http://127.0.0.1:5173 instead
   - Check Windows Firewall settings
   - Make sure no antivirus is blocking the connection

