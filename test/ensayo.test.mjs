// node --test test/  — pruebas mecánicas del plan (docs/PACKET.md)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  avisoSegundos, avisoCiudad, evaluarAccion, siguienteEnsayo, resumen, resumenGrupo,
  leerConfig, leerEnsayos, CONFIG_INICIAL, debilidad,
} from '../lib/ensayo.js'

const cfg = (x = {}) => ({ ...CONFIG_INICIAL, ...x })
const e = (x) => ({ n: 1, tipo: 'sin', hora: 12, noche: false, avisoSeg: 0, accion: 'mesa', segundos: 3, segDesdeTemblor: 3, salida: false, estado: 'SIN_REGLA', ...x })
const seq = (...vals) => { let i = 0; return () => vals[i++ % vals.length] }

test('a) geodatos: CDMX 55–62 s, Acapulco 0, Chilpancingo < 15', () => {
  const cdmx = avisoSegundos('cdmx')
  assert.ok(cdmx >= 55 && cdmx <= 62, `CDMX=${cdmx}`)
  assert.equal(avisoSegundos('acapulco'), 0)
  assert.ok(avisoSegundos('chilpancingo') < 15)
  assert.equal(avisoCiudad('cdmx').epicentro.id, 'guerrero')
  assert.equal(avisoCiudad('tuxtla').epicentro.id, 'tehuantepec')
  assert.equal(avisoSegundos('no-existe'), null)
})

test('b) salida: piso 4+ CONTRA R2; planta baja CONFORME R3; piso 3 sin regla (zona gris)', () => {
  assert.deepEqual([evaluarAccion(cfg({ nivel: 'p4' }), 'salida').estado, evaluarAccion(cfg({ nivel: 'p4' }), 'salida').regla.id], ['CONTRA', 'R2'])
  assert.deepEqual([evaluarAccion(cfg({ nivel: 'pb' }), 'salida').estado, evaluarAccion(cfg({ nivel: 'pb' }), 'salida').regla.id], ['CONFORME', 'R3'])
  assert.equal(evaluarAccion(cfg({ nivel: 'p3' }), 'salida').estado, 'SIN_REGLA')
})

test('c) ventana CONTRA R1 en cualquier nivel; marco sin regla; con PIPC nada se califica', () => {
  for (const nivel of ['pb', 'p1', 'p2', 'p3', 'p4']) assert.equal(evaluarAccion(cfg({ nivel }), 'ventana').regla.id, 'R1')
  assert.equal(evaluarAccion(cfg(), 'marco').estado, 'SIN_REGLA')
  for (const a of ['mesa', 'marco', 'salida', 'ventana', 'persona']) assert.equal(evaluarAccion(cfg({ pipc: 'si', nivel: 'p4' }), a).estado, 'SIN_REGLA')
})

test('d) adaptativa: el tercero repite el más débil a otra hora', () => {
  const h = [
    e({ n: 1, tipo: 'sin', hora: 11, accion: 'ventana', estado: 'CONTRA', segundos: 1.2 }),
    e({ n: 2, tipo: 'con', hora: 15, accion: 'mesa', estado: 'SIN_REGLA', segundos: 6 }),
  ]
  const s = siguienteEnsayo(h, cfg(), seq(0.1))
  assert.equal(s.n, 3); assert.equal(s.tipo, 'sin'); assert.equal(s.repeticion, true)
  assert.ok(![11, 15].includes(s.hora))
  assert.equal(siguienteEnsayo([...h, e({ n: 3 })], cfg()), null)
  // los dos primeros son con y sin aviso, en orden al azar
  const p1 = siguienteEnsayo([], cfg(), seq(0.9, 0.9))
  const p2 = siguienteEnsayo([e({ tipo: p1.tipo })], cfg(), seq(0.2))
  assert.notEqual(p1.tipo, p2.tipo)
  // una acción rápida contra regla es más débil que una lenta sin regla
  assert.ok(debilidad(e({ estado: 'CONTRA', segundos: 0.5 })) > debilidad(e({ segundos: 20 })))
})

test('e) congelarse y salir quedan en el denominador', () => {
  const r = resumen([e({ accion: null, estado: null, segDesdeTemblor: null }), e({ salida: true }), e({ segDesdeTemblor: 4 }), e({ segDesdeTemblor: 6 })])
  assert.equal(r.n, 4)
  assert.equal(r.tasaSinDecision, 0.25)
  assert.equal(r.tasaSalidas, 0.25)
  assert.equal(r.medianaSin, 5)
})

test('f) grupo de 7 oculto; de 11 visible', () => {
  const persona = { ensayos: [e({ tipo: 'sin', segDesdeTemblor: 5 }), e({ tipo: 'con', segDesdeTemblor: -2 })] }
  assert.equal(resumenGrupo(Array(7).fill(persona)).oculto, true)
  const g = resumenGrupo(Array(11).fill(persona))
  assert.equal(g.oculto, false)
  assert.match(g.apuesta, /sí distingue/)
  const igual = { ensayos: [e({ tipo: 'sin', segDesdeTemblor: 3 }), e({ tipo: 'con', segDesdeTemblor: 3 })] }
  assert.match(resumenGrupo(Array(12).fill(igual)).apuesta, /NO está recreando/)
})

test('g) localStorage corrupto o fuera de lista se ignora', () => {
  assert.equal(leerConfig('{no json'), null)
  assert.equal(leerConfig(JSON.stringify({ ...CONFIG_INICIAL, ciudad: 'marte' })), null)
  assert.equal(leerConfig(JSON.stringify({ ...CONFIG_INICIAL, inicio: 3 })), null) // noche no permitida
  assert.deepEqual(leerConfig(JSON.stringify({ ...CONFIG_INICIAL, inicio: 3, permitirNoche: true })).inicio, 3)
  assert.equal(leerConfig(JSON.stringify({ ...CONFIG_INICIAL, inicio: 12, fin: 12 })), null)
  assert.deepEqual(leerEnsayos('[{"n":9,"tipo":"sin","accion":null,"salida":false}, 5, null]'), [])
  assert.equal(leerEnsayos('{}').length, 0)
})
