'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CIUDADES, NIVELES, PIPC, INTENSIDADES, CONFIG_INICIAL, avisoCiudad, validarConfig } from '../../lib/ensayo.js'
import { cargarConfig, guardarConfig, borrarTodo } from '../../lib/almacen.js'

const hh = h => `${String(h).padStart(2, '0')}:00`

function Campo({ label, ayuda, children }) {
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
    const v = validarConfig(c)
    if (!v) {
      setError(c.inicio >= c.fin ? 'La hora de inicio tiene que ser antes que la hora final.' : 'Revisa las horas: sin permitir la noche, van de 07:00 a 22:00.')
      return
    }
    guardarConfig(v)
    router.push('/ensayo')
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
          <p className="text-sm">Si tiembla por un sismo en la {aviso.epicentro.nombre.split(',')[0].toLowerCase()}, en tu ciudad tendrías</p>
          <p className="text-3xl font-bold text-amber-400">≈ {aviso.segundos} segundos <span className="text-base font-normal text-stone-200">de aviso</span></p>
          {aviso.segundos === 0 && <p className="mt-1 text-sm text-amber-200">Prácticamente nada: aquí, tu ensayo "con aviso" se parece mucho al "sin aviso".</p>}
          <p className="mt-2 text-xs text-stone-400">
            Estimación simple por distancia ({aviso.km} km) a una hipótesis oficial de simulacro ({aviso.epicentro.fuente}). No es el cálculo de la alerta sísmica.
            En 2017 (sismo de Puebla-Morelos) la alerta llegó a la CDMX después de que empezó a temblar.
          </p>
        </div>
      )}

      <Campo label="¿En qué nivel vas a ensayar?" ayuda="Donde pasas más tiempo. Cambia qué dice la regla sobre salir o quedarte.">
        <select className={sel} value={c.nivel} onChange={e => set('nivel', e.target.value)}>
          {NIVELES.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
      </Campo>

      <Campo label="¿Tu edificio tiene Programa Interno de Protección Civil?" ayuda="Si lo tiene y dice qué hacer, manda su plan y la app no califica tu decisión.">
        <select className={sel} value={c.pipc} onChange={e => set('pipc', e.target.value)}>
          {PIPC.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
      </Campo>

      <Campo label="¿A qué horas te puede tocar un ensayo?" ayuda="La app elige un momento al azar dentro de estas horas. No te observa para elegirlo.">
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
          Permitir ensayos de noche (apagado de inicio: tus horas de dormir no se tocan)
        </span>
      </Campo>

      <Campo label="Intensidad" ayuda="Qué tan fuerte se mueve y suena el cuarto. Puedes salir del ensayo cuando quieras.">
        <select className={sel} value={c.intensidad} onChange={e => set('intensidad', e.target.value)}>
          {INTENSIDADES.map(x => <option key={x.id} value={x.id}>{x.nombre}</option>)}
        </select>
      </Campo>

      {error && <p className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

      <button onClick={guardar} className="w-full rounded-xl bg-amber-400 py-3 text-base font-bold text-stone-900">Guardar y ensayar</button>

      <div className="border-t border-stone-800 pt-4">
        <button onClick={() => { borrarTodo(); setC(CONFIG_INICIAL); setBorrado(true) }} className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-300">Borrar todo lo guardado en este teléfono</button>
        {borrado && <p className="mt-2 text-sm text-stone-400">Listo: se borró tu configuración, tus ensayos y tus recuerdos.</p>}
      </div>
    </div>
  )
}
