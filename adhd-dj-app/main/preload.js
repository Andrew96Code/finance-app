const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Kick off the full PKCE OAuth flow (opens browser)
  authenticate: () => ipcRenderer.invoke('spotify:authenticate'),

  // Load a previously saved refresh token (for auto-login)
  getRefreshToken: () => ipcRenderer.invoke('spotify:get-refresh-token'),

  // Clear saved tokens
  logout: () => ipcRenderer.invoke('spotify:logout'),
});
