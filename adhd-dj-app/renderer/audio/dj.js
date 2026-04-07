/**
 * DJ Deck — two gain channels with equal-power crossfader.
 *
 * In the Spotify-only version, "Deck A" and "Deck B" represent two independently
 * queued Spotify tracks. The crossfader blends their gain levels.
 *
 * Tone.js is used for BPM-aware scheduling and the transport clock.
 */

import * as Tone from 'tone';
import { getAudioContext } from './context.js';

export class DJDeck {
  constructor() {
    this.ctx = getAudioContext();

    this.deckA = { gain: this.ctx.createGain(), bpm: 120, trackName: null };
    this.deckB = { gain: this.ctx.createGain(), bpm: 120, trackName: null };

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;

    this.deckA.gain.connect(this.master);
    this.deckB.gain.connect(this.master);

    // Start at centre (equal mix)
    this._crossfader = 0.5;
    this._applyEqualPowerCrossfade(this._crossfader);

    // Tone.js transport for BPM sync
    Tone.setContext(this.ctx);
    Tone.getTransport().bpm.value = 120;
  }

  /** Connect an audio source to a deck's gain node. */
  connectSource(deck, sourceNode) {
    sourceNode.connect(this[`deck${deck}`].gain);
  }

  /** Connect deck master output to a downstream node (e.g. AudioContext.destination or 8D engine). */
  connectOutput(destinationNode) {
    this.master.connect(destinationNode);
  }

  disconnectOutput() {
    this.master.disconnect();
  }

  /**
   * Move crossfader.
   * @param {number} position - 0.0 = full Deck A, 1.0 = full Deck B
   */
  setCrossfader(position) {
    this._crossfader = Math.max(0, Math.min(1, position));
    this._applyEqualPowerCrossfade(this._crossfader);
  }

  get crossfader() {
    return this._crossfader;
  }

  _applyEqualPowerCrossfade(position) {
    // Equal-power: no dip in the middle
    const angle = position * (Math.PI / 2);
    const now = this.ctx.currentTime;
    this.deckA.gain.gain.setTargetAtTime(Math.cos(angle), now, 0.01);
    this.deckB.gain.gain.setTargetAtTime(Math.sin(angle), now, 0.01);
  }

  /** Set master output volume (0–1). */
  setMasterVolume(vol) {
    this.master.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.01);
  }

  /** Set the known BPM for a deck (used for sync calculations). */
  setBPM(deck, bpm) {
    this[`deck${deck}`].bpm = bpm;
  }

  /**
   * Sync Deck B's tempo to Deck A.
   * Sets the Tone.js transport BPM and logs the pitch ratio.
   * Full pitch-preserving time-stretch requires a backend audio source
   * (not possible with Spotify streaming) — this is a BPM display sync only.
   */
  syncBPM() {
    const bpmA = this.deckA.bpm;
    const bpmB = this.deckB.bpm;
    const ratio = bpmA / bpmB;

    Tone.getTransport().bpm.value = bpmA;
    console.log(`[DJ] BPM sync — A: ${bpmA}, B: ${bpmB}, ratio: ${ratio.toFixed(3)}`);

    // Surface the ratio for the UI to display
    return { bpmA, bpmB, ratio };
  }

  /**
   * Tap BPM detection — call on each tap, returns current estimate.
   * Uses the last 8 taps, resets if gap > 3 seconds.
   */
  _tapTimes = [];

  tapBPM(deck) {
    const now = performance.now();
    const taps = this._tapTimes;

    if (taps.length > 0 && now - taps[taps.length - 1] > 3000) {
      this._tapTimes = [];
    }

    this._tapTimes.push(now);

    if (this._tapTimes.length > 8) this._tapTimes.shift();
    if (this._tapTimes.length < 2) return null;

    const intervals = [];
    for (let i = 1; i < this._tapTimes.length; i++) {
      intervals.push(this._tapTimes[i] - this._tapTimes[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.round(60000 / avgInterval);

    this.setBPM(deck, bpm);
    return bpm;
  }
}
