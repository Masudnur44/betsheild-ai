(() => {
  // Basic gambling keywords list (can be extended)
  const GAMBLING_KEYWORDS = [
    "bet",
    "casino",
    "poker",
    "blackjack",
    "roulette",
    "sportsbook",
    "odds",
    "wager",
    "gambling",
    "betting",
  ];

  const BACKEND_DEFAULT = "http://localhost:3001";

  function isGamblingDomain(hostname, path) {
    const s = (hostname + " " + path).toLowerCase();
    return GAMBLING_KEYWORDS.some(k => s.includes(k));
  }

  function detectThreat() {
    try {
      const hostname = location.hostname || "";
      // heuristic: hostname is an IP address
      if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return { reason: "ip-hostname" };
      // heuristic: suspicious long hostname with many dashes or numbers
      if ((hostname.match(/-/g) || []).length > 3) return { reason: "many-dashes" };
      // heuristic: page contains forms pointing to external domains
      const forms = Array.from(document.querySelectorAll("form[action]")).map(f => f.getAttribute("action"));
      for (const a of forms) {
        if (!a) continue;
        try {
          const u = new URL(a, location.href);
          if (u.hostname !== location.hostname) return { reason: "form-external-action", action: a };
        } catch (e) {
          // ignore
        }
      }
      return null;
    } catch (e) {
      return { reason: "error-inspection", error: String(e) };
    }
  }

  // minimal storage helpers using chrome.storage if available, else localStorage
  const storage = {
    async get(key) {
      if (window.chrome && chrome.storage && chrome.storage.local) {
        return new Promise(res => chrome.storage.local.get(key, r => res(r[key])));
      }
      return Promise.resolve(JSON.parse(localStorage.getItem(key) || "null"));
    },
    async set(key, value) {
      if (window.chrome && chrome.storage && chrome.storage.local) {
        return new Promise(res => chrome.storage.local.set({ [key]: value }, () => res(true)));
      }
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve(true);
    }
  };

  // Send log to backend
  async function sendLog(event, payload = {}) {
    try {
      const backendUrl = (await storage.get('backendUrl')) || BACKEND_DEFAULT;
      const body = { event, domain: location.hostname, url: location.href, timestamp: new Date().toISOString(), ...payload };
      // Best-effort POST; ignore failures
      await fetch(backendUrl + '/api/extension/log', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    } catch (e) {
      // swallow errors
    }
  }

  // Only run on top-level frames
  if (window.top !== window) return;

  const hostname = location.hostname;
  const path = location.pathname + location.search;
  if (!isGamblingDomain(hostname, path)) return; // not a gambling-like site

  // Start tracking
  let seconds = 0;
  let intervalId = null;
  let sessionId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,6);

  sendLog('visit_start', { sessionId });

  // initial threat check
  const thr = detectThreat();
  if (thr) {
    sendLog('threat', { sessionId, reason: thr.reason || 'unknown', meta: thr });
  }

  function startTimer() {
    intervalId = setInterval(() => {
      seconds += 5;
      // send periodic time updates
      sendLog('time_update', { sessionId, seconds: 5 });
    }, 5000);
  }

  function stopTimer() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }

  startTimer();

  window.addEventListener('beforeunload', () => {
    stopTimer();
    sendLog('visit_end', { sessionId, totalSeconds: seconds });
  });

})();
