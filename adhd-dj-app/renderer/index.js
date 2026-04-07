/**
 * Renderer entry point — boots the app after DOM is ready.
 */

import { boot } from './ui/app.js';

document.addEventListener('DOMContentLoaded', () => {
  boot().catch((err) => {
    console.error('[Boot] Fatal error:', err);
    document.body.innerHTML = `
      <div style="padding:32px;color:#e53935;font-family:monospace">
        <h2>Fatal startup error</h2>
        <pre>${err.message}</pre>
      </div>
    `;
  });
});
