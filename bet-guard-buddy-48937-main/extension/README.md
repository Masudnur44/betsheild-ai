# BetShield Companion Extension

This is a minimal browser extension (Manifest V3) companion for BetShield. It detects visits to gambling-like sites, logs events to the backend and provides a popup to view basic stats.

How to load locally (Chrome/Edge):

1. Open chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder in the repo

The popup lets you set the backend URL (default: `http://localhost:3001`). The extension will POST events to `/api/extension/log` and read aggregated stats from `/api/extension/stats`.

Security:
- Do not deploy the placeholders or commit real secrets to the repository.
