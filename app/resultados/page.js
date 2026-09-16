'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { resumen, ACCIONES, nombreAccion } from '../../lib/ensayo.js'
import { cargarConfig, cargarEnsayos, cargarRecuerdos, guardarRecuerdo, borrarTodo } from '../../lib/almacen.js'
import { Veredicto } from '../../components/Veredicto.js'

const pct = x => `${Math.round(x * 100)}%`

export default function Resultados() {
  const [listo, setListo] = useState(false)
  const [config, setConfig] = useState(null)
  const [ensayos, setEnsayos] = useState([])
  const [recuerdos, setRecuerdos] = useState([])
  const [form, setForm] = useState({ accion: '', segundos: '' })
  const [msg, setMsg] = useState('')

  const cargar = () => { setConfig(cargarConfig()); setEnsayos(cargarEnsayos()); setRecuerdos(cargarRecuerdos()); setListo(true) }
  useEffect(cargar, [])

  function guardarR(ev) {
    ev.preventDefault()
    const s = form.segundos === '' ? null : Number(form.segundos)
    if (!ACCIONES.includes(form.accion) && form.accion !== 'otra') { setMsg('Elige qué hiciste.'); return }
    if (s !== null && (!Number.isFinite(s) || s < 0 || s > 600)) { setMsg('Los segundos van de 0 a 600.'); return }
    guardarRecuerdo({ accion: form.accion, segundos: s, fecha: new Date().toISOString() })
    setForm({ accion: '', segundos: '' }); setMsg('Guardado en este teléfono.'); setRecuerdos(cargarRecuerdos())
  }

  if (!listo) return <p className="text-stone-400">Cargando…</p>
  const r = resumen(ensayos)
  const nivel = config?.nivel || 'p1'

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Mis resultados</h1>
        <p className="text-sm text-stone-400">Solo están en este teléfono. Nadie más los ve.</p>
      </div>

      {ensayos.length === 0 && (
        <div className="space-y-3 rounded-xl border border-stone-800 p-4">
          <p>Todavía no tienes ensayos.</p>
          <Link href="/ensayo" className="inline-block rounded-xl bg-amber-400 px-5 py-3 font-bold text-stone-900">Hacer mi primer ensayo</Link>
        </div>
      )}

      {ensayos.map(e => (
        <section key={e.n} className="space-y-2">
          <h2 className="font-semibold">
            {e.n} · {e.tipo === 'sin' ? 'Sin aviso' : `Con aviso (${e.avisoSeg} s)`}{e.repeticion ? ' · repetición del más débil' : ''} · {String(e.hora).padStart(2, '0')}:00{e.noche ? ' (de noche)' : ''}{e.demo ? ' · modo demo' : ''}
          </h2>
          <Veredicto e={e} nivel={nivel} />
        </section>
      ))}

      {ensayos.length > 0 && (
        <section className="rounded-xl border border-stone-700 bg-stone-900 p-4 text-sm">
          <h2 className="font-semibold">En tus {r.n} ensayo{r.n === 1 ? '' : 's'}</h2>
          <ul className="mt-2 space-y-1 text-stone-300">
            <li>Contradijiste una regla citada: <b>{r.contra}</b> ({pct(r.tasaContra)})</li>
            <li>Sin decisión durante el sismo: <b>{r.sinDecision}</b> ({pct(r.tasaSinDecision)})</li>
            <li>Salidas: <b>{r.salidas}</b> ({pct(r.tasaSalidas)})</li>
          </ul>
          <p className="mt-2 text-xs text-stone-500">Las veces sin decisión y las salidas cuentan en el total: no se quitan para que el resultado se vea mejor.</p>
          {ensayos.length < 3 && <Link href="/ensayo" className="mt-3 inline-block rounded-lg bg-amber-400 px-4 py-2 font-bold text-stone-900">Siguiente ensayo</Link>}
        </section>
      )}

      <section className="rounded-xl border border-stone-800 p-4">
        <h2 className="font-semibold">¿Tembló de verdad?</h2>
        <p className="mt-1 text-sm text-stone-400">Cuéntate qué hiciste, para compararlo con tus ensayos. <b>Es un recuerdo, no una medición</b>: la memoria se equivoca.</p>
        <form onSubmit={guardarR} className="mt-3 space-y-2">
          <select value={form.accion} onChange={ev => setForm(f => ({ ...f, accion: ev.target.value }))} className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5">
            <option value="">¿Qué hiciste?</option>
            {ACCIONES.map(a => <option key={a} value={a}>{nombreAccion(a, nivel)}</option>)}
            <option value="otra">Otra cosa</option>
          </select>
          <input inputMode="decimal" maxLength={5} placeholder="¿Cuántos segundos tardaste en decidir? (aprox.)" value={form.segundos}
            onChange={ev => setForm(f => ({ ...f, segundos: ev.target.value.replace(/[^0-9.]/g, '') }))} className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2.5" />
          <button className="rounded-lg border border-stone-600 px-4 py-2 text-sm">Guardar recuerdo</button>
          {msg && <p className="text-sm text-stone-400">{msg}</p>}
        </form>
        {recuerdos.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-stone-300">
            {recuerdos.map((x, i) => <li key={i}>{new Date(x.fecha).toLocaleDateString('es-MX')}: {x.accion === 'otra' ? 'otra cosa' : nombreAccion(x.accion, nivel)}{x.segundos != null ? `, ~${x.segundos} s` : ''} <span className="text-stone-500">(recuerdo)</span></li>)}
          </ul>
        )}
      </section>

      <button onClick={() => { borrarTodo(); cargar() }} className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-300">Borrar todo lo guardado en este teléfono</button>
    </div>
  )
}
