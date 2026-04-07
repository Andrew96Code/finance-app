// Shared AudioContext singleton — one per app, created lazily on first use
// (browsers require a user gesture before creating/resuming an AudioContext)

let _ctx = null;

export function getAudioContext() {
  if (!_ctx) {
    _ctx = new AudioContext({ sampleRate: 44100, latencyHint: 'interactive' });
  }
  return _ctx;
}

/**
 * Resume the AudioContext after a user gesture. Call this on first play click.
 */
export async function resumeAudioContext() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}
