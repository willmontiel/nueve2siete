// The click of the clicker and of the theme switch, made in the browser with Web Audio: short bursts of filtered
// noise, the sound of hard plastic meeting plastic. Like a real switch it clicks on the way down and, higher and
// softer, on the way up.
let context: AudioContext | null = null
let noise: AudioBuffer | null = null

function audio() {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return null
  if (!context) {
    context = new AudioContextClass()
    // One second of white noise, reused by every burst
    noise = context.createBuffer(1, context.sampleRate, context.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  if (context.state === 'suspended') void context.resume()
  return context
}

interface Burst {
  type?: BiquadFilterType
  freq: number
  q?: number
  gain: number
  /** Seconds it takes to die away */
  decay: number
  /** Seconds after the click starts */
  delay?: number
}

const ATTACK = 0.0005

function burst(ctx: AudioContext, buffer: AudioBuffer, at: number, { type = 'bandpass', freq, q = 1, gain, decay }: Burst) {
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = type
  filter.frequency.value = freq
  filter.Q.value = q
  const envelope = ctx.createGain()
  envelope.gain.setValueAtTime(0.0001, at)
  envelope.gain.linearRampToValueAtTime(gain, at + ATTACK)
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + ATTACK + decay)
  source.connect(filter).connect(envelope).connect(ctx.destination)
  // Each click starts somewhere else in the noise, so no two sound exactly alike
  source.start(at, Math.random() * 0.8)
  source.stop(at + ATTACK + decay + 0.02)
}

// A few percent either way, as no two presses of a real switch are the same
const vary = (value: number) => value * (1 + (Math.random() * 2 - 1) * 0.06)

function play(bursts: Burst[]) {
  try {
    const ctx = audio()
    if (!ctx || !noise) return
    const now = ctx.currentTime
    for (const b of bursts) burst(ctx, noise, now + (b.delay ?? 0), b)
  } catch {
    // Without sound the button still works
  }
}

/** The switch going down: a sharp plastic snap with a short ring */
export function playClick() {
  play([
    { type: 'highpass', freq: 6000, gain: 0.5, decay: 0.003 },
    { freq: vary(3800), q: 9, gain: 1.4, decay: 0.016 },
    { freq: vary(1700), q: 3, gain: 0.35, decay: 0.012, delay: 0.002 },
  ])
}

/** The switch coming back up: the same snap, higher and softer */
export function playClickRelease() {
  play([
    { freq: vary(4300), q: 9, gain: 0.8, decay: 0.012 },
    { type: 'highpass', freq: 6500, gain: 0.25, decay: 0.003 },
  ])
}
