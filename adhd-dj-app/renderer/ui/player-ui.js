/**
 * Player UI — Now Playing panel
 * Controls: play/pause, prev, next, seek, volume, search
 */

import { play, pause, skipNext, skipPrev, seek, setVolume } from '../spotify/player.js';
import { searchTracks } from '../spotify/api.js';

export class PlayerUI {
  /**
   * @param {HTMLElement} container
   * @param {{ getToken: () => string, onTrackLoad: (track) => void }} opts
   */
  constructor(container, opts) {
    this.container = container;
    this.getToken = opts.getToken;
    this.onTrackLoad = opts.onTrackLoad || (() => {});
    this._state = null;
    this._progressInterval = null;
    this._render();
  }

  _render() {
    this.container.innerHTML = `
      <div class="player-now-playing">
        <img id="album-art" class="album-art" src="" alt="Album art" style="display:none">
        <div class="track-info">
          <div id="track-name" class="track-name">—</div>
          <div id="track-artist" class="track-artist">Not playing</div>
        </div>
      </div>

      <div class="player-progress">
        <span id="pos-label" class="time-label">0:00</span>
        <input id="seek-bar" class="slider seek-bar" type="range" min="0" max="100" value="0" aria-label="Seek">
        <span id="dur-label" class="time-label">0:00</span>
      </div>

      <div class="player-controls">
        <button id="prev-btn" class="btn btn-icon" aria-label="Previous" title="Previous (←)">⏮</button>
        <button id="play-btn" class="btn btn-icon btn-play" aria-label="Play/Pause" title="Play/Pause (Space)">▶</button>
        <button id="next-btn" class="btn btn-icon" aria-label="Next" title="Next (→)">⏭</button>
      </div>

      <div class="player-volume">
        <span class="label-sm">Vol</span>
        <input id="vol-slider" class="slider" type="range" min="0" max="100" value="80" aria-label="Volume">
        <span id="vol-value" class="label-sm">80%</span>
      </div>

      <div class="player-search">
        <input id="search-input" class="input" type="search" placeholder="Search Spotify..." aria-label="Search tracks">
        <button id="search-btn" class="btn btn-primary btn-sm">Search</button>
      </div>
      <ul id="search-results" class="search-results" role="listbox" aria-label="Search results"></ul>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const q = (id) => this.container.querySelector(`#${id}`);

    q('play-btn').addEventListener('click', () => this._togglePlay());
    q('prev-btn').addEventListener('click', () => skipPrev(this.getToken()));
    q('next-btn').addEventListener('click', () => skipNext(this.getToken()));

    const seekBar = q('seek-bar');
    seekBar.addEventListener('input', () => {
      if (!this._state) return;
      const ms = (seekBar.value / 100) * this._state.duration;
      seek(this.getToken(), ms);
    });

    const volSlider = q('vol-slider');
    volSlider.addEventListener('input', () => {
      const pct = parseInt(volSlider.value, 10);
      q('vol-value').textContent = `${pct}%`;
      setVolume(this.getToken(), pct);
    });

    q('search-btn').addEventListener('click', () => this._doSearch());
    q('search-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._doSearch();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't fire when typing in an input
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); this._togglePlay(); }
      if (e.code === 'ArrowRight') skipNext(this.getToken());
      if (e.code === 'ArrowLeft') skipPrev(this.getToken());
    });
  }

  async _togglePlay() {
    if (!this._state) return;
    if (this._state.paused) {
      await play(this.getToken());
    } else {
      await pause(this.getToken());
    }
  }

  async _doSearch() {
    const input = this.container.querySelector('#search-input');
    const query = input.value.trim();
    if (!query) return;

    const resultsList = this.container.querySelector('#search-results');
    resultsList.innerHTML = '<li class="search-result-item loading">Searching…</li>';

    try {
      const tracks = await searchTracks(this.getToken(), query);
      resultsList.innerHTML = '';

      if (!tracks.length) {
        resultsList.innerHTML = '<li class="search-result-item muted">No results</li>';
        return;
      }

      tracks.forEach((track) => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '0');
        li.innerHTML = `
          <img src="${track.album?.images?.[2]?.url || ''}" alt="" class="result-thumb">
          <span class="result-name">${track.name}</span>
          <span class="result-artist muted">${track.artists.map((a) => a.name).join(', ')}</span>
        `;
        li.addEventListener('click', () => {
          play(this.getToken(), null, [track.uri]);
          this.onTrackLoad(track);
          resultsList.innerHTML = '';
          input.value = '';
        });
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') li.click();
        });
        resultsList.appendChild(li);
      });
    } catch (err) {
      resultsList.innerHTML = `<li class="search-result-item error">Error: ${err.message}</li>`;
    }
  }

  /** Called by app.js whenever the Spotify player state changes. */
  updateState(state) {
    this._state = state;
    if (!state) return;

    const q = (id) => this.container.querySelector(`#${id}`);
    const track = state.track_window?.current_track;

    if (track) {
      q('track-name').textContent = track.name;
      q('track-artist').textContent = track.artists.map((a) => a.name).join(', ');
      const art = q('album-art');
      const img = track.album?.images?.[0]?.url;
      if (img) { art.src = img; art.style.display = 'block'; }
    }

    q('play-btn').textContent = state.paused ? '▶' : '⏸';
    q('play-btn').setAttribute('aria-label', state.paused ? 'Play' : 'Pause');

    if (state.duration > 0) {
      const pct = (state.position / state.duration) * 100;
      q('seek-bar').value = pct;
      q('pos-label').textContent = formatTime(state.position);
      q('dur-label').textContent = formatTime(state.duration);
    }
  }
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${min}:${sec}`;
}
