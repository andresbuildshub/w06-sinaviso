import { GRUPOS } from '../../lib/grupos.js'
import { GRUPO_MINIMO } from '../../lib/ensayo.js'

const pct = x => `${Math.round(x * 100)}%`
const seg = x => (x == null ? '—' : `${x > 0 ? '+' : ''}${x} s`)

export default function Grupo() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Para quien coordina una escuela, empresa o unidad</p>
        <h1 className="text-2xl font-bold">Vista de grupo</h1>
        <p className="mt-1 text-sm text-stone-300">Aquí nunca aparece una persona. Solo porcentajes del grupo, y solo si el grupo tiene {GRUPO_MINIMO} personas o más.</p>
        <p className="mt-2 inline-block rounded-md border border-amber-300/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-200">Datos inventados · en esta versión nada sale de ningún teléfono</p>
      </div>

      {GRUPOS.map(g => (
        <section key={g.id} className="rounded-xl border border-stone-800 p-4">
          <h2 className="font-semibold">{g.nombre} <span className="font-normal text-stone-400">({g.n} personas)</span></h2>
          {g.resumen.oculto ? (
            <p className="mt-2 rounded-lg border border-stone-600 bg-stone-800/50 p-3 text-sm text-stone-300">{g.resumen.motivo}</p>
          ) : (
            <div className="mt-2 space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['Sin decisión durante el sismo', g.resumen.tasaSinDecision], ['Salieron del ensayo', g.resumen.tasaSalidas], ['Contradijeron una regla citada', g.resumen.tasaContra]].map(([t, v]) => (
                  <div key={t} className="rounded-lg bg-stone-900 p-2"><p className="text-2xl font-bold text-amber-400">{pct(v)}</p><p className="text-[11px] leading-tight text-stone-400">{t}</p></div>
                ))}
              </div>
              <p className="text-stone-300">Mediana de cuándo decidieron, contando desde que empezó a temblar: <b>sin aviso {seg(g.resumen.medianaSin)}</b> · <b>con aviso {seg(g.resumen.medianaCon)}</b> <span className="text-stone-500">(negativo = antes de que temblara)</span></p>
              <p className={`rounded-lg border-l-4 p-3 ${g.resumen.apuesta.includes('NO') ? 'border-red-500 bg-red-500/10' : 'border-emerald-400 bg-emerald-400/10'}`}><b>Prueba de la escena:</b> {g.resumen.apuesta}</p>
            </div>
          )}
        </section>
      ))}

      <section className="rounded-xl border border-stone-700 bg-stone-900 p-4 text-sm text-stone-300">
        <h2 className="font-semibold text-stone-100">Qué no hace esta vista</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>No entrega resultados individuales ni constancias por persona. Por eso no sirve como comprobante de capacitación.</li>
          <li>Los porcentajes de "sin decisión" y "salidas" nunca se quitan del total.</li>
          <li>No dice si alguien actuaría bien en un sismo real: nadie lo ha medido para ningún tipo de simulacro.</li>
        </ul>
      </section>
    </div>
  )
}
