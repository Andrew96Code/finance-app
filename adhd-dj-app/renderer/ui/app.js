/**
 * Root UI controller — wires everything together:
 *   Auth → Spotify player → Audio capture → 8D engine → DJ deck → UI panels
 */

import { initPlayer } from '../spotify/player.js';
import { startTokenRefreshCycle, searchTracks } from '../spotify/api.js';
import { resumeAudioContext } from '../audio/context.js';
import { captureSpotifyAudio } from '../audio/capture.js';
import { Effect8D } from '../audio/effect8d.js';
import { DJDeck } from '../audio/dj.js';
import { PlayerUI } from './player-ui.js';
import { EffectUI } from './effect-ui.js';
import { DJUI } from './dj-ui.js';

// ─── Constants ───────────────────────────────────────────────────────────────
const CLIENT_ID = 'PLACEHOLDER'; // replaced at runtime by env var injection

// ─── State ───────────────────────────────────────────────────────────────────
let _token = null;
let _refreshToken = null;
let _stopTokenRefresh = null;
let _audioConnected = false;

// ─── Singletons ──────────────────────────────────────────────────────────────
let effect8d = null;
let djDeck = null;
let playerUI = null;
let effectUI = null;
let djUI = null;

// ─── Status helpers ──────────────────────────────────────────────────────────
function setStatus(msg, type = 'info') {
  const el = document.getElementById('status-msg');
  if (!el) return;
  el.textContent = msg;
  el.className = `status-msg status-${type}`;
}

function setCaptureStatus(connected) {
  const el = document.getElementById('capture-status');
  if (!el) return;
  el.textContent = connected ? '● Audio' : '○ Audio';
  el.title = connected ? 'Audio capture active' : 'Audio not captured';
  el.className = `capture-badge ${connected ? 'capture-on' : 'capture-off'}`;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function tryAutoLogin() {
  try {
    const saved = await window.electronAPI.getRefreshToken();
    if (!saved) return false;

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: saved,
        client_id: CLIENT_ID,
      }),
    });

    if (!res.ok) return false;
    const data = await res.json();
    _token = data.access_token;
    _refreshToken = saved;
    return true;
  } catch {
    return false;
  }
}

// ─── Audio pipeline setup ────────────────────────────────────────────────────
async function connectAudioPipeline() {
  if (_audioConnected) return;

  setStatus('Requesting audio capture…');
  try {
    await resumeAudioContext();
    const source = await captureSpotifyAudio();

    effect8d = new Effect8D();
    djDeck = new DJDeck();

    // Signal chain: source → 8D engine → DJ master → speakers
    effect8d.connect(source, djDeck.deckA.gain);
    effect8d.connect(source, djDeck.deckB.gain);
    djDeck.connectOutput(source.context.destination);

    _audioConnected = true;
    setCaptureStatus(true);
    setStatus('Audio connected', 'success');

    // Re-render effect and DJ panels now that singletons exist
    renderEffectPanel();
    renderDJPanel();
  } catch (err) {
    setStatus(`Audio capture failed: ${err.message}`, 'error');
    setCaptureStatus(false);
  }
}

// ─── Panel renders ────────────────────────────────────────────────────────────
function renderPlayerPanel() {
  const container = document.getElementById('player-panel');
  playerUI = new PlayerUI(container, {
    getToken: () => _token,
    onTrackLoad: (track) => {
      // Auto-load into Deck A by default
      if (djUI) djUI.loadTrack('A', track);
    },
  });
}

function renderEffectPanel() {
  if (!effect8d) return;
  const container = document.getElementById('effect-panel');
  effectUI = new EffectUI(container, effect8d);
}

function renderDJPanel() {
  if (!djDeck) return;
  const container = document.getElementById('dj-panel');
  djUI = new DJUI(container, djDeck, { getToken: () => _token });

  // Handle dj:load-search event from DJUI
  container.addEventListener('dj:load-search', async (e) => {
    const { deck, query } = e.detail;
    setStatus(`Searching for "${query}"…`);
    try {
      const tracks = await searchTracks(_token, query);
      if (tracks.length) {
        await djUI.loadTrack(deck, tracks[0]);
        setStatus(`Loaded "${tracks[0].name}" onto Deck ${deck}`, 'success');
      } else {
        setStatus('No tracks found', 'error');
      }
    } catch (err) {
      setStatus(`Search failed: ${err.message}`, 'error');
    }
  });
}

// ─── Spotify player state ─────────────────────────────────────────────────────
function onSpotifyStateChange(state) {
  if (playerUI) playerUI.updateState(state);
}

// ─── Screen transitions ───────────────────────────────────────────────────────
function showMainScreen() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'flex';
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
export async function boot() {
  // Login button
  document.getElementById('login-btn').addEventListener('click', async () => {
    setStatus('Opening Spotify login…');
    try {
      const tokens = await window.electronAPI.authenticate();
      _token = tokens.access_token;
      _refreshToken = tokens.refresh_token;
      await onAuthenticated();
    } catch (err) {
      setStatus(`Login failed: ${err.message}`, 'error');
    }
  });

  // Logout button
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await window.electronAPI.logout();
    location.reload();
  });

  // Try auto-login from saved token
  const autoLoggedIn = await tryAutoLogin();
  if (autoLoggedIn) {
    await onAuthenticated();
  }
}

async function onAuthenticated() {
  showMainScreen();

  // Start token refresh cycle
  if (_refreshToken) {
    _stopTokenRefresh = startTokenRefreshCycle(_refreshToken, CLIENT_ID, (newToken) => {
      _token = newToken;
    });
  }

  // Render player panel immediately
  renderPlayerPanel();

  // Placeholder effect/DJ panels until audio is captured
  document.getElementById('effect-panel').innerHTML =
    '<div class="panel-placeholder">Click play to enable audio capture</div>';
  document.getElementById('dj-panel').innerHTML =
    '<div class="panel-placeholder">Audio capture required for DJ decks</div>';

  // Wait for Spotify SDK to be ready, then init player
  window.onSpotifyWebPlaybackSDKReady = () => {
    initPlayer(_token, onSpotifyStateChange);
  };

  // If SDK already fired before our handler was set
  if (window.Spotify) {
    initPlayer(_token, onSpotifyStateChange);
  }

  // First play gesture triggers audio capture
  document.addEventListener('spotify:play-clicked', connectAudioPipeline, { once: true });
}
