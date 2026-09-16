// La regla va ANTES que el tiempo: una decisión rápida que contradice una regla citada no se ve como un buen resultado.
import { REGLAS, nombreAccion, resultadoDe } from '../lib/ensayo.js'

const TONO = {
  CONTRA: 'border-red-500 bg-red-500/10',
  CONFORME: 'border-emerald-400 bg-emerald-400/10',
  SIN_REGLA: 'border-stone-500 bg-stone-500/10',
  SIN_DECISION: 'border-stone-500 bg-stone-500/10',
  SALIDA: 'border-sky-400 bg-sky-400/10',
}

export function Veredicto({ e, nivel }) {
  const r = resultadoDe(e)
  const regla = e.reglaId ? REGLAS[e.reglaId] : null
  return (
    <div className={`space-y-2 rounded-xl border-l-4 p-4 ${TONO[r]}`}>
      {r === 'SALIDA' && <p><b className="text-sky-300">SALIDA</b> — saliste del ensayo antes de que terminara. Se cuenta; no se esconde.</p>}
      {r === 'SIN_DECISION' && <p><b>SIN DECISIÓN DURANTE EL SISMO</b> — no tocaste ningún lugar antes de que terminara.</p>}
      {e.accion && (
        <>
          <p>Tocaste <b>{nombreAccion(e.accion, nivel)}</b>.</p>
          {r === 'CONTRA' && <p><b className="text-red-300">CONTRADICE UNA REGLA CITADA:</b> “{regla.cita}”</p>}
          {r === 'CONFORME' && <p><b className="text-emerald-300">VA DE ACUERDO CON UNA REGLA CITADA:</b> “{regla.cita}”</p>}
          {r === 'SIN_REGLA' && <p><b>SIN REGLA CITADA — no se califica.</b> {e.nota}</p>}
          {regla && <p className="text-xs text-stone-400">Fuente: <a className="underline" href={regla.url} target="_blank" rel="noreferrer">{regla.fuente}</a></p>}
          <p className="text-stone-300">
            Tardaste <b>{e.segundos} s</b> en decidir desde la primera señal
            {e.tipo === 'con' && (e.segDesdeTemblor < 0 ? ` (decidiste ${Math.abs(e.segDesdeTemblor)} s antes de que empezara a temblar)` : ` (${e.segDesdeTemblor} s después de que empezó a temblar)`)}.
          </p>
        </>
      )}
      <p className="text-xs text-stone-500">Esto mide cuánto tardas en decidir y si contradices una regla citada. No mide lo que haría tu cuerpo en un sismo real.</p>
    </div>
  )
}
