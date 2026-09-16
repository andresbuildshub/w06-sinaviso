'use client'
// Todo vive en este teléfono (localStorage). Nada se manda a un servidor.
import { leerConfig, leerEnsayos } from './ensayo.js'

const K_CONFIG = 'sinaviso.config.v1'
const K_ENSAYOS = 'sinaviso.ensayos.v1'
const K_RECUERDOS = 'sinaviso.recuerdos.v1'

const ls = () => { try { return window.localStorage } catch { return null } }

export function cargarConfig() { const s = ls(); return s ? leerConfig(s.getItem(K_CONFIG)) : null }
export function guardarConfig(c) { ls()?.setItem(K_CONFIG, JSON.stringify(c)) }
export function cargarEnsayos() { const s = ls(); return s ? leerEnsayos(s.getItem(K_ENSAYOS)) : [] }
export function guardarEnsayo(e) {
  const todos = cargarEnsayos().filter(x => x.n !== e.n)
  ls()?.setItem(K_ENSAYOS, JSON.stringify([...todos, e].sort((a, b) => a.n - b.n)))
}
export function cargarRecuerdos() {
  try { const v = JSON.parse(ls()?.getItem(K_RECUERDOS) || '[]'); return Array.isArray(v) ? v.slice(-10) : [] } catch { return [] }
}
export function guardarRecuerdo(r) { ls()?.setItem(K_RECUERDOS, JSON.stringify([...cargarRecuerdos(), r].slice(-10))) }
export function borrarEnsayos() { ls()?.removeItem(K_ENSAYOS) }
export function borrarTodo() { const s = ls(); if (!s) return; [K_CONFIG, K_ENSAYOS, K_RECUERDOS].forEach(k => s.removeItem(k)) }
