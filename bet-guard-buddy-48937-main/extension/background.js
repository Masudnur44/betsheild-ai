// background service worker (currently minimal)
self.addEventListener('install', event => {
  // noop
});

self.addEventListener('activate', event => {
  // noop
});

// forward clicks from popup or other parts if necessary
self.addEventListener('message', (ev) => {
  // console.log('BG message', ev);
});
