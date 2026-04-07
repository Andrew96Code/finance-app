/**
 * MediaStream capture — bridges Spotify's locked-down playback into the Web Audio graph.
 *
 * Two strategies (tried in order):
 *   1. getDisplayMedia (audio-only) — works in Electron without extra hardware
 *   2. getUserMedia with a loopback device — fallback for when getDisplayMedia is unavailable
 *      (requires BlackHole on macOS or VB-Cable on Windows)
 *
 * The user will see a system permission prompt once on first use.
 * Trigger this on a user gesture (e.g. first play click).
 */

import { getAudioContext } from './context.js';

let _sourceNode = null;
let _stream = null;

export async function captureSpotifyAudio() {
  if (_sourceNode) return _sourceNode; // already captured

  const ctx = getAudioContext();

  try {
    // Strategy 1: getDisplayMedia with audio — no extra hardware needed
    _stream = await navigator.mediaDevices.getDisplayMedia({
      video: false,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: 44100,
      },
    });
  } catch (displayErr) {
    console.warn('[Capture] getDisplayMedia failed, trying loopback device:', displayErr.message);

    // Strategy 2: loopback audio device (VB-Cable / BlackHole)
    try {
      _stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });
    } catch (loopbackErr) {
      throw new Error(
        'Cannot capture audio. Install a loopback device (VB-Cable on Windows / BlackHole on macOS) ' +
        'and select it when prompted.\n\nOriginal error: ' + loopbackErr.message
      );
    }
  }

  _sourceNode = ctx.createMediaStreamSource(_stream);
  return _sourceNode;
}

export function getSourceNode() {
  return _sourceNode;
}

/** Stop the MediaStream and release resources. */
export function releaseCapture() {
  if (_stream) {
    _stream.getTracks().forEach((t) => t.stop());
    _stream = null;
  }
  _sourceNode = null;
}
