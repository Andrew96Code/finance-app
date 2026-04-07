const http = require('http');
const crypto = require('crypto');
const { shell } = require('electron');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:8888/callback';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');

// --- PKCE helpers ---
function generateCodeVerifier() {
  return crypto.randomBytes(64).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

// --- State ---
let _codeVerifier = null;

function getAuthUrl() {
  _codeVerifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(_codeVerifier);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });
  return `https://accounts.spotify.com/authorize?${params}`;
}

async function exchangeCode(code) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: _codeVerifier,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${res.statusText}`);
  }

  return res.json(); // { access_token, refresh_token, expires_in }
}

function startAuthServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost:8888');
      if (url.pathname === '/callback') {
        const error = url.searchParams.get('error');
        if (error) {
          res.end('<html><body><h2>Auth failed: ' + error + '</h2></body></html>');
          server.close();
          reject(new Error(`Spotify auth error: ${error}`));
          return;
        }

        const code = url.searchParams.get('code');
        res.end(`
          <html>
            <body style="background:#0d0d0d;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
              <h2 style="color:#1db954">Connected! You can close this tab.</h2>
            </body>
          </html>
        `);
        server.close();

        try {
          const tokens = await exchangeCode(code);
          resolve(tokens);
        } catch (err) {
          reject(err);
        }
      }
    });

    server.on('error', reject);
    server.listen(8888, () => {
      shell.openExternal(getAuthUrl());
    });
  });
}

module.exports = { startAuthServer, getAuthUrl };
