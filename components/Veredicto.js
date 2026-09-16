// Resultado en lenguaje simple (prueba de persona). La guía oficial va antes que el tiempo,
// para que una decisión rápida que va contra la guía no parezca un buen resultado.
import { explicacionSimple, tiempoTexto } from '../lib/ensayo.js'

const TONO = {
  CONTRA: 'border-red-500 bg-red-500/10',
  CONFORME: 'border-emerald-400 bg-emerald-400/10',
  SIN_REGLA: 'border-stone-400 bg-stone-500/10',
  SIN_DECISION: 'border-amber-400 bg-amber-400/10',
  SALIDA: 'border-sky-400 bg-sky-400/10',
}

function Cita({ g }) {
  if (!g) return null
  return (
    <blockquote className="rounded-lg bg-stone-950/60 p-3 text-base">
      “{g.cita}”
      <span className="mt-1 block text-xs text-stone-400">— <a className="underline" href={g.url} target="_blank" rel="noreferrer">{g.fuente}</a></span>
    </blockquote>
  )
}

export function Veredicto({ e, config }) {
  const x = explicacionSimple(e, config || {})
  const t = tiempoTexto(e)
  return (
    <div className={`space-y-3 rounded-xl border-l-4 p-4 ${TONO[x.tono]}`}>
      <p className="text-lg font-bold leading-snug">{x.titulo}</p>
      {x.texto && <p className="text-stone-200">{x.texto}</p>}
      {x.tono !== 'SIN_REGLA' && x.tono !== 'SIN_DECISION' && <Cita g={x.guia} />}
      {x.paso && <p className="text-stone-200">{x.paso}</p>}
      {(x.tono === 'SIN_REGLA' || x.tono === 'SIN_DECISION') && <Cita g={x.guia} />}
      {x.extra && (<><p className="text-stone-200">{x.extra.texto} CENAPRED dice:</p><Cita g={x.extra.guia} /></>)}
      {t && <p className="text-stone-300">{t} <span className="text-stone-400">Todavía no hay datos para decir si es mucho o poco.</span></p>}
      <p className="text-xs text-stone-400">Esto mide cuánto tardas en decidir y si tu decisión va contra la guía oficial. No mide lo que haría tu cuerpo en un sismo de verdad.</p>
    </div>
  )
}
