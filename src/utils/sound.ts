// Sintetizador Web Audio API de clic mecánico de alta precisión (estilo Cherry MX)
let audioCtx: AudioContext | null = null

export function playMechanicalClick() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    if (!audioCtx) {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    const t = audioCtx.currentTime

    // 1. Clic metálico agudo de la lámina táctil (tactile leaf)
    const oscClick = audioCtx.createOscillator()
    const gainClick = audioCtx.createGain()
    oscClick.type = 'triangle'
    oscClick.frequency.setValueAtTime(3200, t)
    oscClick.frequency.exponentialRampToValueAtTime(800, t + 0.015)

    gainClick.gain.setValueAtTime(0.35, t)
    gainClick.gain.exponentialRampToValueAtTime(0.001, t + 0.018)

    oscClick.connect(gainClick)
    gainClick.connect(audioCtx.destination)

    oscClick.start(t)
    oscClick.stop(t + 0.02)

    // 2. Golpe seco del vástago plástico ("clack" característico de switch)
    const oscClack = audioCtx.createOscillator()
    const gainClack = audioCtx.createGain()
    oscClack.type = 'sine'
    oscClack.frequency.setValueAtTime(540, t + 0.002)
    oscClack.frequency.exponentialRampToValueAtTime(150, t + 0.045)

    gainClack.gain.setValueAtTime(0.3, t + 0.002)
    gainClack.gain.exponentialRampToValueAtTime(0.001, t + 0.05)

    oscClack.connect(gainClack)
    gainClack.connect(audioCtx.destination)

    oscClack.start(t + 0.002)
    oscClack.stop(t + 0.055)
  } catch {
    // Si el usuario aún no interactuó con el DOM, silenciar
  }
}
