/**
 * Effect UI — 8D audio controls panel
 * Toggle, rotation speed slider, depth (width) slider, animated rotation ring
 */

import { Effect8D } from '../audio/effect8d.js';

export class EffectUI {
  /**
   * @param {HTMLElement} container
   * @param {Effect8D} effect8d - shared Effect8D instance
   */
  constructor(container, effect8d) {
    this.container = container;
    this.effect = effect8d;
    this._ringAnimFrame = null;
    this._render();
  }

  _render() {
    this.container.innerHTML = `
      <div class="effect-header">
        <h2 class="panel-title">8D Audio</h2>
        <label class="toggle-label" aria-label="Toggle 8D audio">
          <input id="effect-toggle" type="checkbox" class="toggle-input" aria-label="8D on/off">
          <span class="toggle-track">
            <span class="toggle-thumb"></span>
          </span>
        </label>
      </div>

      <p class="effect-hint" id="headphones-hint" style="display:none">
        🎧 Use headphones for best 8D effect
      </p>

      <div class="effect-ring-wrap" aria-hidden="true">
        <canvas id="ring-canvas" class="ring-canvas" width="120" height="120"></canvas>
      </div>

      <div class="effect-controls">
        <label class="control-row">
          <span class="control-label">Rotation speed</span>
          <input id="speed-slider" class="slider" type="range"
            min="5" max="200" value="20" step="1"
            aria-label="Rotation speed" aria-valuemin="0.05" aria-valuemax="2.0">
          <span id="speed-value" class="control-value">0.20 Hz</span>
        </label>

        <label class="control-row">
          <span class="control-label">Width</span>
          <input id="depth-slider" class="slider" type="range"
            min="0" max="100" value="100" step="1"
            aria-label="Stereo width">
          <span id="depth-value" class="control-value">100%</span>
        </label>
      </div>
    `;

    this._bindEvents();
    this._drawRing(0); // initial still ring
  }

  _bindEvents() {
    const q = (id) => this.container.querySelector(`#${id}`);

    const toggle = q('effect-toggle');
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        this.effect.enable();
        q('headphones-hint').style.display = 'block';
        this.container.querySelector('.effect-ring-wrap').classList.add('ring-active');
        this._animateRing();
      } else {
        this.effect.disable();
        q('headphones-hint').style.display = 'none';
        this.container.querySelector('.effect-ring-wrap').classList.remove('ring-active');
        cancelAnimationFrame(this._ringAnimFrame);
        this._drawRing(0);
      }
    });

    // Keyboard shortcut: 8 toggles 8D
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === '8') {
        toggle.checked = !toggle.checked;
        toggle.dispatchEvent(new Event('change'));
      }
    });

    q('speed-slider').addEventListener('input', (e) => {
      const hz = parseInt(e.target.value, 10) / 100;
      this.effect.setSpeed(hz);
      q('speed-value').textContent = `${hz.toFixed(2)} Hz`;
    });

    q('depth-slider').addEventListener('input', (e) => {
      const pct = parseInt(e.target.value, 10);
      this.effect.setDepth(pct / 100);
      q('depth-value').textContent = `${pct}%`;
    });
  }

  _animateRing() {
    this._ringAnimFrame = requestAnimationFrame(() => {
      this._drawRing(this.effect._lfoPhase);
      if (this.effect.enabled) this._animateRing();
    });
  }

  _drawRing(phase) {
    const canvas = this.container.querySelector('#ring-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 60, cy = 60, r = 40;

    ctx.clearRect(0, 0, 120, 120);

    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#242424';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Active arc (shows rotation progress)
    if (this.effect.enabled) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + phase, false);
      ctx.strokeStyle = '#7c4dff';
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    // Dot at current position
    const dotX = cx + Math.sin(phase) * r * this.effect.depth;
    const dotY = cy - Math.cos(phase) * r * this.effect.depth;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
    ctx.fillStyle = this.effect.enabled ? '#7c4dff' : '#444';
    ctx.fill();

    // Centre dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#555';
    ctx.fill();
  }
}
