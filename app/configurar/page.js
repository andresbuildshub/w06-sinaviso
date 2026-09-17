'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CIUDADES, NIVELES, PIPC, INTENSIDADES, CONFIG_INICIAL, avisoCiudad, validarConfig } from '../../lib/ensayo.js'
import { cargarConfig, guardarConfig, borrarTodo } from '../../lib/almacen.js'

const hh = h => `${String(h).padStart(2, '0')}:00`

function Campo({ label, ayuda, children, grupo = false }) {
  // grupo: botones → fieldset/legend (un <label> que envuelve botones le roba el nombre accesible al primero)
  if (grupo) return (
    <fieldset className="block rounded-xl border border-stone-800 p-3">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden="true" className="block text-sm font-semibold">{label}</span>
      {ayuda && <span className="mt-0.5 block text-xs text-stone-300">{ayuda}</span>}
      <div className="mt-2">{children}</div>
    </fieldset>
  )
  return (
    <label className="block rounded-xl border border-stone-800 p-3">
      <span className="block text-sm font-semibold">{label}</span>
      {ayuda && <span className="mt-0.5 block text-xs text-stone-400">{ayuda}</span>}
      <div className="mt-2">{children}</div>
    </label>
  )
}
const sel = 'w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5 text-base'

export default function Configurar() {
  const router = useRouter()
  const [c, setC] = useState(CONFIG_INICIAL)
  const [aviso, setAviso] = useState(null)
  const [error, setError] = useState('')
  const [borrado, setBorrado] = useState(false)

  useEffect(() => { const g = cargarConfig(); if (g) setC(g) }, [])
  useEffect(() => { setAviso(avisoCiudad(c.ciudad)) }, [c.ciudad])

  const set = (k, v) => { setC(x => ({ ...x, [k]: v })); setError(''); setBorrado(false) }
  const horasInicio = Array.from({ length: 24 }, (_, h) => h).filter(h => c.permitirNoche || (h >= 7 && h <= 21))
  const horasFin = Array.from({ length: 24 }, (_, i) => i + 1).filter(h => c.permitirNoche || (h >= 8 && h <= 22))

  function guardar() {
    const demo = new URLSearchParams(window.location.search).get('demo') === '1'
    const v = validarConfig(c)
    if (!v) {
      setError(c.inicio >= c.fin ? 'La hora de inicio tiene que ser antes que la hora final.' : 'Revisa las horas: sin permitir la noche, van de 07:00 a 22:00.')
      return
    }
    guardarConfig(v)
    router.push(demo ? '/ensayo?demo=1' : '/ensayo')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">1 · Dónde y cuándo ensayas</h1>
      <p className="text-sm text-stone-400">Se guarda solo en este teléfono.</p>

      <Campo label="Ciudad" ayuda="La más cercana a donde vives. Sirve para calcular tus segundos de aviso.">
        <select className={sel} value={c.ciudad} onChange={e => set('ciudad', e.target.value)}>
          {CIUDADES.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
      </Campo>

      {aviso && (
        <div className="rounded-xl border-2 border-amber-400 bg-amber-400/10 p-4">
          <p className="text-base">Si el sismo viene de lejos (de la {aviso.epicentro.nombre.split(',')[0].replace('Costa', 'costa').replace('Golfo', 'golfo')}), podrías tener</p>
          <p className="text-3xl font-bold text-amber-400">unos {aviso.segundos} segundos <span className="text-base font-normal text-stone-100">de aviso…</span></p>
          <p className="text-xl font-bold text-amber-200">…o ninguno, como el 19 de septiembre de 2017.</p>
          {aviso.segundos === 0 && <p className="mt-1 text-base text-amber-100">En tu ciudad, aun si viene de lejos, casi no hay aviso.</p>}
          <p className="mt-2 text-sm text-stone-300">Es una cuenta aproximada por distancia ({aviso.km} km), no la de la alerta sísmica. Por eso ensayas los dos casos.</p>
        </div>
      )}

      <Campo label="¿En qué piso pasas más tiempo?" ayuda="La guía oficial dice cosas distintas para pisos bajos y pisos altos: en pisos bajos se puede salir; en pisos altos, no durante el sismo.">
        <select className={sel} value={c.nivel} onChange={e => set('nivel', e.target.value)}>
          {NIVELES.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
      </Campo>

      <Campo label="¿Casa o edificio?" ayuda="Si tu edificio ya tiene su plan de Protección Civil, sigue ese plan: la app no califica tu decisión.">
        <select className={sel} value={c.pipc} onChange={e => set('pipc', e.target.value)}>
          {PIPC.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
      </Campo>

      <Campo grupo label="¿Vives con alguien que no puede moverse rápido?" ayuda="Por ejemplo, alguien con andadera, en silla de ruedas, o un bebé.">
        <div className="flex gap-2">
          {[[true, 'Sí'], [false, 'No']].map(([v, t]) => (
            <button key={t} type="button" aria-pressed={c.cuida === v} onClick={() => set('cuida', v)} className={`flex-1 rounded-lg border px-3 py-2.5 text-base ${c.cuida === v ? 'border-amber-400 bg-amber-400/20 font-bold' : 'border-stone-700'}`}>{t}</button>
          ))}
        </div>
      </Campo>

      <Campo label="¿A qué horas te puede tocar un ensayo?" ayuda="La app elige un momento al azar dentro de estas horas.">
        <div className="flex items-center gap-2">
          <select aria-label="Desde" className={sel} value={c.inicio} onChange={e => set('inicio', Number(e.target.value))}>
            {horasInicio.map(h => <option key={h} value={h}>{hh(h)}</option>)}
          </select>
          <span className="text-stone-400">a</span>
          <select aria-label="Hasta" className={sel} value={c.fin} onChange={e => set('fin', Number(e.target.value))}>
            {horasFin.map(h => <option key={h} value={h}>{hh(h)}</option>)}
          </select>
        </div>
        <span className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-5 w-5" checked={c.permitirNoche}
            onChange={e => { const v = e.target.checked; setC(x => v ? { ...x, permitirNoche: true } : { ...x, permitirNoche: false, inicio: Math.max(7, Math.min(x.inicio, 21)), fin: Math.min(22, Math.max(x.fin, 8)) }); setError('') }} />
          ¿También de noche? (normalmente no, para no despertarte)
        </span>
      </Campo>

      <Campo label="Intensidad" ayuda="Qué tan fuerte se mueve y suena el cuarto. Puedes terminar el ensayo cuando quieras.">
        <select className={sel} value={c.intensidad} onChange={e => set('intensidad', e.target.value)}>
          {INTENSIDADES.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
      </Campo>

      {error && <p className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

      <button onClick={guardar} className="w-full rounded-xl bg-amber-400 py-3 text-base font-bold text-stone-900">Guardar y ensayar</button>

      <div className="border-t border-stone-800 pt-4">
        <button onClick={() => { borrarTodo(); setC(CONFIG_INICIAL); setBorrado(true) }} className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-300">Borrar mis ensayos de esta app (tus fotos y mensajes no se tocan)</button>
        {borrado && <p className="mt-2 text-sm text-stone-400">Listo: se borraron tus datos de esta app. Nada más de tu teléfono se tocó.</p>}
      </div>
    </div>
  )
}
