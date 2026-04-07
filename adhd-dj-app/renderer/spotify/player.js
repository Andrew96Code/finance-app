// Spotify Web Playback SDK wrapper
// The SDK is loaded via <script> in index.html and exposes window.Spotify

let _player = null;
let _deviceId = null;

/**
 * Initialise the Spotify player. Call this inside window.onSpotifyWebPlaybackSDKReady
 * or after confirming window.Spotify is available.
 *
 * @param {string} accessToken
 * @param {(state: object|null) => void} onStateChange
 * @returns {Spotify.Player}
 */
export function initPlayer(accessToken, onStateChange) {
  _player = new window.Spotify.Player({
    name: 'ADHD DJ App',
    getOAuthToken: (cb) => cb(accessToken),
    volume: 0.8,
  });

  _player.addListener('ready', ({ device_id }) => {
    console.log('[Spotify] Player ready, device:', device_id);
    _deviceId = device_id;
    transferPlayback(accessToken, device_id);
  });

  _player.addListener('not_ready', ({ device_id }) => {
    console.warn('[Spotify] Device went offline:', device_id);
  });

  _player.addListener('initialization_error', ({ message }) => {
    console.error('[Spotify] Init error:', message);
  });

  _player.addListener('authentication_error', ({ message }) => {
    console.error('[Spotify] Auth error:', message);
  });

  _player.addListener('account_error', ({ message }) => {
    console.error('[Spotify] Account error (Premium required?):', message);
  });

  _player.addListener('player_state_changed', onStateChange);

  _player.connect();
  return _player;
}

export function getPlayer() {
  return _player;
}

export function getDeviceId() {
  return _deviceId;
}

async function transferPlayback(token, deviceId) {
  await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ device_ids: [deviceId], play: false }),
  });
}

export async function play(token, contextUri = null, uris = null) {
  const body = {};
  if (contextUri) body.context_uri = contextUri;
  if (uris) body.uris = uris;

  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${_deviceId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function pause(token) {
  await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function skipNext(token) {
  await fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function skipPrev(token) {
  await fetch('https://api.spotify.com/v1/me/player/previous', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function setVolume(token, volumePercent) {
  await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.round(volumePercent)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function seek(token, positionMs) {
  await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
}
