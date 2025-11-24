document.addEventListener('DOMContentLoaded', async () => {
  const backendEl = document.getElementById('backendUrl');
  const out = document.getElementById('out');
  const saveBtn = document.getElementById('saveBtn');
  const fetchBtn = document.getElementById('fetchStats');

  async function getStorage(key) {
    if (window.chrome && chrome.storage && chrome.storage.local) {
      return new Promise(res => chrome.storage.local.get(key, r => res(r[key])));
    }
    return Promise.resolve(JSON.parse(localStorage.getItem(key) || 'null'));
  }
  async function setStorage(key, value) {
    if (window.chrome && chrome.storage && chrome.storage.local) {
      return new Promise(res => chrome.storage.local.set({ [key]: value }, () => res(true)));
    }
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve(true);
  }

  const backend = (await getStorage('backendUrl')) || 'http://localhost:3001';
  backendEl.value = backend;

  saveBtn.addEventListener('click', async () => {
    await setStorage('backendUrl', backendEl.value.trim());
    out.textContent = 'Saved.';
  });

  fetchBtn.addEventListener('click', async () => {
    out.textContent = 'Fetching...';
    try {
      const url = (await getStorage('backendUrl')) || 'http://localhost:3001';
      const r = await fetch(url + '/api/extension/stats');
      const j = await r.json();
      out.textContent = JSON.stringify(j, null, 2);
    } catch (e) {
      out.textContent = 'Error: ' + e;
    }
  });
});
