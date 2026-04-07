// Spotify Web API helpers

const BASE = 'https://api.spotify.com/v1';

async function apiFetch(token, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Spotify API ${res.status}`);
  }
  return res.json();
}

export async function searchTracks(token, query) {
  const data = await apiFetch(token, `/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
  return data.tracks.items;
}

export async function getAudioFeatures(token, trackId) {
  // Returns: tempo (BPM), energy, danceability, key, mode, etc.
  return apiFetch(token, `/audio-features/${trackId}`);
}

export async function getTrack(token, trackId) {
  return apiFetch(token, `/tracks/${trackId}`);
}

export async function getCurrentPlayback(token) {
  return apiFetch(token, '/me/player');
}

/**
 * Refresh an expired access token using the stored refresh token.
 * Schedule this every 55 minutes.
 */
export async function refreshAccessToken(refreshToken, clientId) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  return res.json(); // { access_token, expires_in, ... }
}

/**
 * Start a 55-minute refresh cycle.
 * @param {string} refreshToken
 * @param {string} clientId
 * @param {(newToken: string) => void} onRefresh - called with the new access token
 * @returns {() => void} cancel function
 */
export function startTokenRefreshCycle(refreshToken, clientId, onRefresh) {
  const INTERVAL_MS = 55 * 60 * 1000;

  const id = setInterval(async () => {
    try {
      const data = await refreshAccessToken(refreshToken, clientId);
      onRefresh(data.access_token);
    } catch (err) {
      console.error('[Auth] Token refresh failed:', err);
    }
  }, INTERVAL_MS);

  return () => clearInterval(id);
}
