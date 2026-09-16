'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { siguienteEnsayo, avisoSegundos, evaluarAccion, nombreAccion, resultadoDe, NIVELES } from '../../lib/ensayo.js'
import { cargarConfig, cargarEnsayos, guardarEnsayo, borrarEnsayos } from '../../lib/almacen.js'
import { crearAudio, tonoAviso, retumbo } from '../../lib/audio.js'
import { Veredicto } from '../../components/Veredicto.js'

const Cuarto = dynamic(() => import('../../components/Cuarto.js'), { ssr: false, loading: () => <div className="h-[58vh] min-h-[340px] rounded-xl border border-stone-700 bg-stone-900" /> })

const DURACION_TEMBLOR = 25 // s, inventada
const azar = (a, b) => a + Math.random() * (b - a)
const hh = h => `${String(h).padStart(2, '0')}:00`

export default function Ensayo() {
  const [config, setConfig] = useState(undefined)
  const [plan, setPlan] = useState(null)
  const [fase, setFase] = useState('cargando') // cargando | sinconfig | terminado | listo | esperando | toque | calma | aviso | temblor | resultado
  const [elegida, setElegida] = useState(null)
  const [registro, setRegistro] = useState(null)
  const [demo, setDemo] = useState(false)
  const [notif, setNotif] = useState('default')

  const t = useRef({})
  const timers = useRef([])
  const audio = useRef(null)
  const pararRetumbo = useRef(() => {})
  const vib = useRef(null)
  const faseRef = useRef(fase); faseRef.current = fase
  const elegidaRef = useRef(null)
  const listoRef = useRef(false)

  const limpiarTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; clearInterval(vib.current); try { navigator.vibrate?.(0) } catch {} }
  const despues = (s, fn) => { timers.current.push(setTimeout(fn, s * 1000)) }
  const factor = demo ? 0.25 : 1

  const preparar = useCallback(() => {
    const c = cargarConfig()
    setConfig(c)
    setDemo(new URLSearchParams(window.location.search).get('demo') === '1')
    if ('Notification' in window) setNotif(Notification.permission)
    if (!c) { setFase('sinconfig'); return }
    const hechos = cargarEnsayos()
    const p = siguienteEnsayo(hechos, c)
    if (!p) { setFase('terminado'); return }
    setPlan({ ...p, avisoSeg: avisoSegundos(c.ciudad) })
    setElegida(null); elegidaRef.current = null; setRegistro(null)
    setFase('listo')
  }, [])

  useEffect(() => { preparar(); return () => { limpiarTimers(); pararRetumbo.current() } }, [preparar])

  const terminar = useCallback((salida = false) => {
    if (!['calma', 'aviso', 'temblor'].includes(faseRef.current)) return
    limpiarTimers(); pararRetumbo.current()
    const accion = salida ? null : elegidaRef.current?.accion ?? null
    const ev = accion ? evaluarAccion(config, accion) : null
    const r = {
      n: plan.n, tipo: plan.tipo, hora: plan.hora, noche: plan.noche, avisoSeg: plan.avisoSeg, repeticion: plan.repeticion,
      accion, segundos: accion ? elegidaRef.current.segundos : null, segDesdeTemblor: accion ? elegidaRef.current.segDesdeTemblor : null,
      salida, estado: ev ? ev.estado : null, reglaId: ev?.regla?.id ?? null, nota: ev?.nota ?? null,
      fecha: new Date().toISOString(), demo,
    }
    guardarEnsayo(r); setRegistro(r); setFase('resultado')
  }, [config, plan, demo])

  // salir de la página durante el ensayo = SALIDA (se cuenta, no se descarta)
  useEffect(() => {
    const h = () => { if (document.visibilityState === 'hidden') terminar(true) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [terminar])

  async function pedirPermiso() {
    try { setNotif(await Notification.requestPermission()) } catch {}
  }

  function estoyListo() {
    try { navigator.serviceWorker?.register('/sw.js') } catch {}
    import('../../components/Cuarto.js').catch(() => {}); import('three').catch(() => {}) // precarga: la carga nunca cuenta en el reloj
    setFase('esperando')
    despues(azar(8, 40) * factor, async () => {
      setFase('toque')
      try { navigator.vibrate?.([250, 120, 250]) } catch {}
      try {
        if (Notification.permission === 'granted') {
          const reg = await navigator.serviceWorker?.getRegistration()
          reg?.showNotification('Sin Aviso', { body: 'Es un ensayo de sismo. Toca Empezar.', tag: 'sinaviso' })
        }
      } catch {}
    })
  }

  function empezar() {
    audio.current = audio.current || crearAudio()
    listoRef.current = false
    setFase('calma')
  }

  // El reloj de calma empieza cuando el cuarto ya se dibujó, no antes: en un teléfono lento la carga no puede comerse los segundos.
  function cuartoListo() {
    if (listoRef.current || faseRef.current !== 'calma') return
    listoRef.current = true
    despues(azar(4, 12) * factor, () => {
      const ahora = performance.now()
      const aviso = plan.tipo === 'con' ? plan.avisoSeg * factor : 0
      t.current = { primeraSenal: ahora, temblor: ahora + aviso * 1000 }
      const temblar = () => {
        t.current.temblor = performance.now()
        setFase('temblor')
        pararRetumbo.current = retumbo(audio.current, config.intensidad)
        try { navigator.vibrate?.(900); vib.current = setInterval(() => { try { navigator.vibrate?.(900) } catch {} }, 1000) } catch {}
        despues(DURACION_TEMBLOR * factor, () => terminar(false))
      }
      if (plan.tipo === 'con') {
        tonoAviso(audio.current)
        setFase('aviso')
        if (aviso > 0) despues(aviso, temblar); else temblar()
      } else temblar()
    })
  }

  function elegir(accion) {
    if (elegidaRef.current || !['aviso', 'temblor'].includes(faseRef.current)) return
    const ahora = performance.now()
    const e = { accion, segundos: (ahora - t.current.primeraSenal) / 1000 / factor, segDesdeTemblor: (ahora - t.current.temblor) / 1000 / factor }
    e.segundos = Math.round(e.segundos * 10) / 10; e.segDesdeTemblor = Math.round(e.segDesdeTemblor * 10) / 10
    elegidaRef.current = e; setElegida(accion)
  }

  function otraRonda() { borrarEnsayos(); preparar() }

  if (fase === 'cargando') return <p className="text-stone-400">Cargando…</p>
  if (fase === 'sinconfig') return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Primero, dónde ensayas</h1>
      <p className="text-stone-300">Necesitamos tu ciudad, tu piso y tus horas. Se guarda solo en este teléfono.</p>
      <Link href="/configurar" className="inline-block rounded-xl bg-amber-400 px-5 py-3 font-bold text-stone-900">Configurar</Link>
    </div>
  )
  if (fase === 'terminado') return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Ya hiciste tus 3 ensayos</h1>
      <p className="text-stone-300">Tres, nunca treinta. Revisa cómo te fue.</p>
      <div className="flex flex-wrap gap-2">
        <Link href="/resultados" className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-stone-900">Ver mis resultados</Link>
        <button onClick={otraRonda} className="rounded-xl border border-stone-600 px-4 py-3 text-sm">Otra ronda (borra estos 3)</button>
      </div>
    </div>
  )

  const enCuarto = ['calma', 'aviso', 'temblor'].includes(fase)
  return (
    <div className="space-y-4">
      {demo && <p className="rounded-md border border-sky-400/50 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">MODO DEMO: todos los tiempos van 4 veces más rápido. Los segundos que ves se reportan en tiempo normal.</p>}

      {fase === 'listo' && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Ensayo {plan.n} de 3{plan.repeticion ? ' · repetición' : ''}</p>
          <h1 className="text-2xl font-bold">{plan.repeticion ? `Repetimos el que te salió peor (el ${plan.repiteDe}), a otra hora` : 'Un momento cualquiera de tu día'}</h1>
          <p className="text-stone-300">Imagina que son las <b>{hh(plan.hora)}</b>{plan.noche ? ', ya oscureció' : ''}. Estás en la sala, en {NIVELES.find(x => x.id === config.nivel)?.nombre.toLowerCase()}, con una señora mayor sentada en el sofá.</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-stone-300">
            <li>Te va a llegar un aviso de que <b>es un ensayo</b>. Lo único sorpresa es <b>cuándo</b>.</li>
            <li>Cuando empiece, a veces suena un tono antes y a veces no. No sabes cuál te toca.</li>
            <li>Si tiembla, <b>toca en el cuarto el lugar a donde vas</b>. Una sola vez.</li>
            <li>Puedes salir cuando quieras. Salir también se cuenta, no se esconde.</li>
          </ul>
          <p className="rounded-lg border border-amber-300/40 px-3 py-2 text-xs text-amber-200">
            SIMULADO: en la versión completa el aviso llega solo, a una hora al azar dentro de tus horas ({hh(config.inicio)}–{hh(config.fin)}). Aquí llega en algún momento del próximo minuto después de tocar "Estoy listo".
          </p>
          {'Notification' in (typeof window !== 'undefined' ? window : {}) && notif === 'default' && (
            <button onClick={pedirPermiso} className="rounded-lg border border-stone-600 px-3 py-2 text-sm">Permitir que el aviso aparezca como notificación (opcional)</button>
          )}
          <button onClick={estoyListo} className="w-full rounded-xl bg-amber-400 py-3 text-base font-bold text-stone-900">Estoy listo</button>
        </div>
      )}

      {fase === 'esperando' && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-lg">Esperando el aviso…</p>
          <p className="text-sm text-stone-400">Puedes dejar el teléfono a un lado. Deja esta página abierta.</p>
        </div>
      )}

      {fase === 'toque' && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-xl border-2 border-amber-400 bg-amber-400/10 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Aviso</p>
          <p className="text-2xl font-bold">Es un ensayo de sismo.</p>
          <p className="text-stone-300">Sube el volumen. Cuando estés lista, toca Empezar.</p>
          <button onClick={empezar} className="w-full max-w-xs rounded-xl bg-amber-400 py-4 text-lg font-bold text-stone-900">Empezar</button>
        </div>
      )}

      {enCuarto && (
        <div className="space-y-3">
          <Cuarto key={plan.n} fase={fase} intensidad={config.intensidad} noche={plan.noche} nivel={config.nivel} elegida={elegida} onElegir={elegir} onListo={cuartoListo} />
          <div className="min-h-[3.5rem] text-center" aria-live="polite">
            {fase === 'calma' && <p className="text-stone-400">{hh(plan.hora)} · un día normal en tu sala.</p>}
            {fase === 'aviso' && !elegida && <p className="text-lg font-bold text-amber-300">¡Suena el tono de aviso! Toca a dónde vas.</p>}
            {fase === 'temblor' && !elegida && <p className="text-lg font-bold text-amber-300">Está temblando. Toca a dónde vas.</p>}
            {elegida && <p className="text-base">Elegiste <b>{nombreAccion(elegida, config.nivel)}</b>. Quédate hasta que termine.</p>}
          </div>
          <button onClick={() => terminar(true)} className="w-full rounded-lg border border-stone-700 py-2 text-sm text-stone-300">Salir del ensayo (cuenta como salida)</button>
        </div>
      )}

      {fase === 'resultado' && registro && (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Ensayo {registro.n} de 3 · terminado</p>
          <h1 className="text-2xl font-bold">Este ensayo era {registro.tipo === 'sin' ? 'SIN AVISO' : `CON AVISO (${registro.avisoSeg} s)`}</h1>
          <p className="text-sm text-stone-400">{registro.tipo === 'sin' ? 'Como el 19 de septiembre de 2017 en la CDMX: empezó a temblar sin tono antes.' : `El tono sonó ${registro.avisoSeg} segundos antes del temblor, lo que calculamos para tu ciudad.`}</p>
          <Veredicto e={registro} nivel={config.nivel} />
          {registro.n < 3
            ? <button onClick={preparar} className="w-full rounded-xl bg-amber-400 py-3 text-base font-bold text-stone-900">Siguiente ensayo ({registro.n + 1} de 3)</button>
            : <Link href="/resultados" className="block w-full rounded-xl bg-amber-400 py-3 text-center text-base font-bold text-stone-900">Ver mis 3 resultados</Link>}
          {resultadoDe(registro) === 'SALIDA' && <p className="text-xs text-stone-500">Si salir fue por miedo o incomodidad, puedes bajar la intensidad en Configurar.</p>}
        </div>
      )}
    </div>
  )
}
