/**
 * 8D Audio Engine
 *
 * Uses a PannerNode in HRTF mode. An LFO drives the azimuth angle, creating
 * the illusion of sound rotating around the listener's head.
 *
 * Best experienced with stereo headphones. Show a notice when enabled.
 */

import { getAudioContext } from './context.js';

export class Effect8D {
  constructor() {
    this.ctx = getAudioContext();

    // LFO state
    this._speed = 0.2;   // Hz — rotations per second
    this._depth = 1.0;   // 0–1 — how wide the circle is
    this._enabled = false;
    this._lfoPhase = 0;
    this._lastTimestamp = null;
    this._animFrame = null;

    this._setupNodes();
  }

  _setupNodes() {
    // HRTF panner for realistic head-related binaural positioning
    this.panner = this.ctx.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'linear';
    this.panner.refDistance = 1;
    this.panner.maxDistance = 10000;
    this.panner.rolloffFactor = 0;
    this.panner.coneInnerAngle = 360;
    this.panner.coneOuterAngle = 0;
    this.panner.coneOuterGain = 0;
    this.panner.setPosition(0, 0, 1);

    // Input / output gain wrappers for clean connect/disconnect
    this.inputGain = this.ctx.createGain();
    this.outputGain = this.ctx.createGain();

    this.inputGain.connect(this.panner);
    this.panner.connect(this.outputGain);
  }

  /**
   * Wire source → 8D engine → destination.
   * @param {AudioNode} sourceNode
   * @param {AudioNode} destinationNode
   */
  connect(sourceNode, destinationNode) {
    sourceNode.connect(this.inputGain);
    this.outputGain.connect(destinationNode);
  }

  /** Disconnect from destination. */
  disconnect() {
    this.outputGain.disconnect();
  }

  enable() {
    if (this._enabled) return;
    this._enabled = true;
    this._lastTimestamp = null;
    this._animFrame = requestAnimationFrame((ts) => this._animate(ts));
  }

  disable() {
    if (!this._enabled) return;
    this._enabled = false;
    cancelAnimationFrame(this._animFrame);
    this._animFrame = null;
    // Reset to front-centre
    this.panner.setPosition(0, 0, 1);
  }

  get enabled() {
    return this._enabled;
  }

  _animate(timestamp) {
    if (!this._enabled) return;

    // Delta-time LFO so speed is frame-rate independent
    if (this._lastTimestamp !== null) {
      const dt = (timestamp - this._lastTimestamp) / 1000; // seconds
      this._lfoPhase += this._speed * Math.PI * 2 * dt;
      if (this._lfoPhase > Math.PI * 2) this._lfoPhase -= Math.PI * 2;
    }
    this._lastTimestamp = timestamp;

    // Circular motion on the XZ plane (Y = 0 keeps sound at ear level)
    const x = Math.sin(this._lfoPhase) * this._depth;
    const z = Math.cos(this._lfoPhase) * this._depth;
    this.panner.setPosition(x, 0, z);

    this._animFrame = requestAnimationFrame((ts) => this._animate(ts));
  }

  /** @param {number} hz - rotation speed in Hz (0.05–2.0) */
  setSpeed(hz) {
    this._speed = Math.max(0.05, Math.min(2.0, hz));
  }

  get speed() { return this._speed; }

  /** @param {number} depth - panning width 0–1 */
  setDepth(depth) {
    this._depth = Math.max(0, Math.min(1, depth));
  }

  get depth() { return this._depth; }
}
