'use client'
// Sonido generado en el navegador. El tono de aviso es propio (tres notas suaves), NUNCA el sonido SASMEX.
export function crearAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    const ctx = new AC()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch { return null }
}

export function tonoAviso(ctx) {
  if (!ctx) return
  const notas = [880, 1108.7, 1318.5]
  for (let r = 0; r < 2; r++) {
    notas.forEach((f, i) => {
      const t = ctx.currentTime + r * 1.1 + i * 0.28
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.type = 'sine'; o.frequency.value = f
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.25, t + 0.03); g.gain.exponentialRampToValueAtTime(0.001, t + 0.26)
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.3)
    })
  }
}

const VOL = { suave: 0.35, media: 0.6, fuerte: 0.9 }

export function retumbo(ctx, intensidad = 'media') {
  if (!ctx) return () => {}
  const len = ctx.sampleRate * 2
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 }
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140
  const g = ctx.createGain(); const t = ctx.currentTime
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(VOL[intensidad] ?? 0.6, t + 1.5)
  src.connect(lp).connect(g).connect(ctx.destination); src.start()
  return () => { try { const n = ctx.currentTime; g.gain.cancelScheduledValues(n); g.gain.setValueAtTime(g.gain.value, n); g.gain.linearRampToValueAtTime(0, n + 0.6); src.stop(n + 0.7) } catch {} }
}
