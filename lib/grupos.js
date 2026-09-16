// DATOS INVENTADOS para mostrar la vista de grupo. En esta versión nada sale de ningún teléfono, así que no hay datos reales de grupo.
import { resumenGrupo } from './ensayo.js'

function rng(semilla) { let s = semilla >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }

function persona(r, perfil) {
  const ensayos = []
  for (const [n, tipo] of [[1, 'sin'], [2, 'con']]) {
    const x = r()
    if (x < perfil.salida) { ensayos.push({ n, tipo, accion: null, salida: true, estado: null, segDesdeTemblor: null }); continue }
    if (x < perfil.salida + perfil.congela) { ensayos.push({ n, tipo, accion: null, salida: false, estado: null, segDesdeTemblor: null }); continue }
    const contra = r() < perfil.contra
    const base = tipo === 'sin' ? perfil.sin : perfil.con
    ensayos.push({ n, tipo, accion: contra ? 'ventana' : 'mesa', salida: false, estado: contra ? 'CONTRA' : 'SIN_REGLA', segDesdeTemblor: Math.round((base + (r() - 0.5) * 3) * 10) / 10 })
  }
  return { ensayos }
}

export const GRUPOS = [
  { id: 'oficina', nombre: 'Despacho contable', n: 7, semilla: 7, perfil: { salida: 0.05, congela: 0.3, contra: 0.2, sin: 4, con: -6 } },
  { id: 'unidad', nombre: 'Unidad habitacional en Iztapalapa', n: 24, semilla: 24, perfil: { salida: 0.1, congela: 0.3, contra: 0.15, sin: 5.5, con: -8 } },
  { id: 'secundaria', nombre: 'Secundaria, turno matutino', n: 38, semilla: 38, perfil: { salida: 0.04, congela: 0.12, contra: 0.1, sin: 3.2, con: 3.0 } },
].map(g => { const r = rng(g.semilla); return { ...g, resumen: resumenGrupo(Array.from({ length: g.n }, () => persona(r, g.perfil))) } })
