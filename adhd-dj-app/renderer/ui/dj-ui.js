/**
 * DJ UI — Two decks + crossfader
 * Each deck: track name, BPM display, load-from-search button, tap BPM
 */

import { DJDeck } from '../audio/dj.js';
import { getAudioFeatures } from '../spotify/api.js';
import { play } from '../spotify/player.js';

export class DJUI {
  /**
   * @param {HTMLElement} container
   * @param {DJDeck} djDeck - shared DJDeck instance
   * @param {{ getToken: () => string }} opts
   */
  constructor(container, djDeck, opts) {
    this.container = container;
    this.deck = djDeck;
    this.getToken = opts.getToken;
    this._loadedTracks = { A: null, B: null };
    this._render();
  }

  _render() {
    this.container.innerHTML = `
      <h2 class="panel-title">DJ Decks</h2>

      <div class="dj-decks">
        ${this._deckHTML('A')}
        <div class="dj-centre">
          <div class="crossfader-wrap">
            <span class="deck-label deck-label-a">A</span>
            <input id="crossfader" class="slider crossfader-slider" type="range"
              min="0" max="100" value="50" aria-label="Crossfader">
            <span class="deck-label deck-label-b">B</span>
          </div>
          <div class="master-vol-wrap">
            <span class="label-sm">Master</span>
            <input id="master-vol" class="slider" type="range"
              min="0" max="100" value="90" aria-label="Master volume">
            <span id="master-vol-value" class="label-sm">90%</span>
          </div>
          <button id="sync-btn" class="btn btn-accent btn-sm">BPM Sync</button>
          <div id="sync-info" class="sync-info muted"></div>
        </div>
        ${this._deckHTML('B')}
      </div>
    `;

    this._bindEvents();
  }

  _deckHTML(deck) {
    const color = deck === 'A' ? 'var(--accent)' : 'var(--accent2)';
    return `
      <div class="dj-deck deck-${deck.toLowerCase()}" data-deck="${deck}">
        <div class="deck-header">
          <span class="deck-id" style="color:${color}">Deck ${deck}</span>
          <span id="bpm-${deck}" class="deck-bpm">— BPM</span>
        </div>
        <div id="deck-track-${deck}" class="deck-track-name muted">No track loaded</div>
        <div class="deck-actions">
          <button id="load-btn-${deck}" class="btn btn-ghost btn-sm" data-deck="${deck}">Load track</button>
          <button id="tap-btn-${deck}" class="btn btn-ghost btn-sm tap-btn" data-deck="${deck}">Tap BPM</button>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    const q = (id) => this.container.querySelector(`#${id}`);

    q('crossfader').addEventListener('input', (e) => {
      this.deck.setCrossfader(parseInt(e.target.value, 10) / 100);
    });

    q('master-vol').addEventListener('input', (e) => {
      const pct = parseInt(e.target.value, 10);
      this.deck.setMasterVolume(pct / 100);
      q('master-vol-value').textContent = `${pct}%`;
    });

    q('sync-btn').addEventListener('click', () => {
      const result = this.deck.syncBPM();
      if (result) {
        q('sync-info').textContent =
          `A: ${result.bpmA} → B: ${result.bpmB} (×${result.ratio.toFixed(2)})`;
      }
    });

    // Load buttons — open an inline search prompt
    ['A', 'B'].forEach((deck) => {
      q(`load-btn-${deck}`).addEventListener('click', () => {
        this._promptLoadTrack(deck);
      });

      q(`tap-btn-${deck}`).addEventListener('click', () => {
        const bpm = this.deck.tapBPM(deck);
        if (bpm) q(`bpm-${deck}`).textContent = `${bpm} BPM`;
      });
    });
  }

  /**
   * Load a track onto a deck. Called externally when user drags a search result
   * onto a deck, or internally via the load button inline search.
   */
  async loadTrack(deck, track) {
    this._loadedTracks[deck] = track;

    const q = (id) => this.container.querySelector(`#${id}`);
    q(`deck-track-${deck}`).textContent = `${track.name} — ${track.artists.map((a) => a.name).join(', ')}`;
    q(`deck-track-${deck}`).classList.remove('muted');

    // Fetch BPM from Spotify audio features
    try {
      const features = await getAudioFeatures(this.getToken(), track.id);
      if (features?.tempo) {
        const bpm = Math.round(features.tempo);
        this.deck.setBPM(deck, bpm);
        q(`bpm-${deck}`).textContent = `${bpm} BPM`;
      }
    } catch {
      // BPM fetch failure is non-critical
    }
  }

  _promptLoadTrack(deck) {
    const name = prompt(`Load track onto Deck ${deck} — enter track name to search:`);
    if (!name) return;
    // Emit a custom event that app.js can intercept to run a search
    this.container.dispatchEvent(new CustomEvent('dj:load-search', {
      bubbles: true,
      detail: { deck, query: name },
    }));
  }
}
