/** Optional MP3/WAV samples — drop files in public/audio/ (see public/audio/README.md) */

const cache = new Map<string, AudioBuffer>()

export async function loadAudioSample(
  ctx: AudioContext,
  path: string,
): Promise<AudioBuffer | null> {
  if (cache.has(path)) return cache.get(path)!

  try {
    const res = await fetch(path)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const decoded = await ctx.decodeAudioData(buf)
    cache.set(path, decoded)
    return decoded
  } catch {
    return null
  }
}

export const AUDIO_PATHS = {
  rainHeavy:    '/audio/ambient/rain-heavy.mp3',
  rainLoop:     '/audio/ambient/rain-loop.mp3',
  batsSwarm:    '/audio/sfx/bats-swarm.mp3',
  doorCreak:    '/audio/sfx/door-creak.mp3',
  jokerLaugh:   '/audio/sfx/joker-laugh-distant.mp3',
  windHowl:     '/audio/ambient/wind-howl.mp3',
} as const

export function playBuffer(
  ctx: AudioContext,
  bus: GainNode,
  buffer: AudioBuffer,
  volume: number,
  loop = false,
  fadeInSec = 0,
): { stop: () => void } {
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = loop
  const g = ctx.createGain()
  const t = ctx.currentTime
  if (fadeInSec > 0) {
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(volume, t + fadeInSec)
  } else {
    g.gain.value = volume
  }
  src.connect(g)
  g.connect(bus)
  src.start()
  return { stop: () => { try { src.stop() } catch { /* */ } } }
}
