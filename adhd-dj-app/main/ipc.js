const { startAuthServer } = require('./auth');
const { safeStorage } = require('electron');

const REFRESH_TOKEN_KEY = 'spotify_refresh_token';

function registerIpcHandlers(ipcMain) {
  // Renderer asks main to start the full PKCE auth flow
  ipcMain.handle('spotify:authenticate', async () => {
    const tokens = await startAuthServer();

    // Persist refresh token using OS-level encryption
    if (tokens.refresh_token && safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(tokens.refresh_token);
      // Store in a simple file next to the app; in prod use electron-store
      const fs = require('fs');
      const path = require('path');
      const tokenPath = path.join(__dirname, '../.refresh_token');
      fs.writeFileSync(tokenPath, encrypted);
    }

    return tokens;
  });

  // Renderer asks main to load a persisted refresh token
  ipcMain.handle('spotify:get-refresh-token', () => {
    const fs = require('fs');
    const path = require('path');
    const tokenPath = path.join(__dirname, '../.refresh_token');

    try {
      if (!fs.existsSync(tokenPath)) return null;
      const encrypted = fs.readFileSync(tokenPath);
      if (!safeStorage.isEncryptionAvailable()) return null;
      return safeStorage.decryptString(encrypted);
    } catch {
      return null;
    }
  });

  // Renderer asks main to clear saved tokens (logout)
  ipcMain.handle('spotify:logout', () => {
    const fs = require('fs');
    const path = require('path');
    const tokenPath = path.join(__dirname, '../.refresh_token');
    try {
      if (fs.existsSync(tokenPath)) fs.unlinkSync(tokenPath);
    } catch { /* ignore */ }
  });
}

module.exports = { registerIpcHandlers };
