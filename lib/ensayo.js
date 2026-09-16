// Sin Aviso — lógica pura (sin DOM). Reglas citadas, geodatos, lógica adaptativa y resúmenes.
// La app nunca escribe su propia regla: solo califica con citas oficiales textuales.
export const VERSION = 'v0.1 · 16-sep-2026'

// ── Geodatos ────────────────────────────────────────────────────────────────
// Capitales de los 11 estados con altavoces SASMEX (+ Acapulco). Coordenadas aproximadas.
export const CIUDADES = [
  { id: 'cdmx', nombre: 'Ciudad de México', lat: 19.4326, lon: -99.1332 },
  { id: 'toluca', nombre: 'Toluca, Edomex', lat: 19.2826, lon: -99.6557 },
  { id: 'cuernavaca', nombre: 'Cuernavaca, Morelos', lat: 18.9242, lon: -99.2216 },
  { id: 'puebla', nombre: 'Puebla, Puebla', lat: 19.0414, lon: -98.2063 },
  { id: 'tlaxcala', nombre: 'Tlaxcala, Tlaxcala', lat: 19.3139, lon: -98.2404 },
  { id: 'chilpancingo', nombre: 'Chilpancingo, Guerrero', lat: 17.5515, lon: -99.5006 },
  { id: 'acapulco', nombre: 'Acapulco, Guerrero', lat: 16.8531, lon: -99.8237 },
  { id: 'oaxaca', nombre: 'Oaxaca, Oaxaca', lat: 17.0732, lon: -96.7266 },
  { id: 'morelia', nombre: 'Morelia, Michoacán', lat: 19.706, lon: -101.195 },
  { id: 'colima', nombre: 'Colima, Colima', lat: 19.2433, lon: -103.725 },
  { id: 'guadalajara', nombre: 'Guadalajara, Jalisco', lat: 20.6597, lon: -103.3496 },
  { id: 'tuxtla', nombre: 'Tuxtla Gutiérrez, Chiapas', lat: 16.7516, lon: -93.1161 },
]

// Hipótesis costeras de simulacros nacionales oficiales (coordenadas aproximadas del texto de cada convocatoria).
export const EPICENTROS = [
  { id: 'guerrero', nombre: 'Costa de Guerrero, M8.2', fuente: '1er Simulacro Nacional 2026 (6-may-2026): 55 km al noroeste de Acapulco', lat: 17.2, lon: -100.22 },
  { id: 'michoacan', nombre: 'Costa de Michoacán, M8.1', fuente: '2º Simulacro Nacional 2025 (19-sep-2025): Lázaro Cárdenas, Michoacán', lat: 17.96, lon: -102.19 },
  { id: 'tehuantepec', nombre: 'Golfo de Tehuantepec, M7.6', fuente: '2º Simulacro Nacional 2026 (19-sep-2026): suroeste de Tonalá, Chiapas', lat: 15.8, lon: -94.0 },
]

export const VEL_ONDA_S = 3.5 // km/s, onda S (aprox.)
export const RETRASO_ALERTA = 20 // s, supuesto: detección + proceso + difusión. Calibrado a "hasta ~60 s para CDMX" (SASMEX).

export function distanciaKm(a, b) {
  const R = 6371, rad = x => (x * Math.PI) / 180
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function ciudad(id) { return CIUDADES.find(c => c.id === id) || null }

// Segundos de aviso estimados en la ciudad para el sismo costero hipotético oficial más cercano.
export function avisoCiudad(ciudadId) {
  const c = ciudad(ciudadId)
  if (!c) return null
  const [ep, km] = EPICENTROS.map(e => [e, distanciaKm(c, e)]).sort((x, y) => x[1] - y[1])[0]
  const segundos = Math.max(0, Math.round(km / VEL_ONDA_S - RETRASO_ALERTA))
  return { segundos, km: Math.round(km), epicentro: ep }
}
export function avisoSegundos(ciudadId) { return avisoCiudad(ciudadId)?.segundos ?? null }

// ── Reglas citadas (textuales) ──────────────────────────────────────────────
export const REGLAS = {
  R1: {
    id: 'R1', cita: 'Aléjate de ventanas y objetos que puedan caer',
    fuente: 'CENAPRED, infografía "Actúa en caso de sismo" (con SSN, 2025); también gob.mx/cenapred, "Qué hacer en caso de sismo" (21-feb-2020)',
    url: 'https://www.cenapred.gob.mx/es/Publicaciones/archivos/258-INFOGRAFAENCASODESISMO.PDF',
  },
  R2: {
    id: 'R2', cita: 'Si te encuentras en un piso más alto, durante el sismo no es recomendable intentar evacuar',
    fuente: 'Manual de Protección Civil del STCONAPRA, citado por Infobae (17-feb-2026). CENAPRED: "la regla no es fija para todos los casos"',
    url: 'https://www.infobae.com/mexico/2026/02/18/simulacro-en-mexico-a-partir-de-que-piso-me-toca-hacer-repliegue-y-cuando-debo-salir/',
  },
  R3: {
    id: 'R3', cita: 'Si te encuentras en los primeros dos o tres pisos, puedes evacuar durante el sismo utilizando las escaleras',
    fuente: 'Manual de Protección Civil del STCONAPRA, citado por Infobae (17-feb-2026)',
    url: 'https://www.infobae.com/mexico/2026/02/18/simulacro-en-mexico-a-partir-de-que-piso-me-toca-hacer-repliegue-y-cuando-debo-salir/',
  },
  R4: {
    id: 'R4', cita: 'junto a muros estructurales, bajo trabes o mesas resistentes, lejos de ventanas y objetos que puedan caer',
    fuente: 'Manual de Protección Civil del STCONAPRA, citado por Infobae (17-feb-2026), para pisos altos',
    url: 'https://www.infobae.com/mexico/2026/02/18/simulacro-en-mexico-a-partir-de-que-piso-me-toca-hacer-repliegue-y-cuando-debo-salir/',
  },
}

export const NIVELES = [
  { id: 'pb', nombre: 'Planta baja' },
  { id: 'p1', nombre: 'Piso 1' },
  { id: 'p2', nombre: 'Piso 2' },
  { id: 'p3', nombre: 'Piso 3' },
  { id: 'p4', nombre: 'Piso 4 o más alto' },
]
export const PIPC = [
  { id: 'casa', nombre: 'Vivo en casa, no en edificio' },
  { id: 'no', nombre: 'Edificio sin plan' },
  { id: 'nose', nombre: 'No sé' },
  { id: 'si', nombre: 'Sí, mi edificio tiene plan y dice qué hacer' },
]
export const INTENSIDADES = [
  { id: 'suave', nombre: 'Suave' },
  { id: 'media', nombre: 'Media' },
  { id: 'fuerte', nombre: 'Fuerte' },
]

export function nombreAccion(accion, nivel) {
  return {
    mesa: 'la mesa', marco: 'el marco de la puerta', ventana: 'la ventana', persona: 'la señora del sofá',
    salida: nivel === 'pb' ? 'la puerta a la calle' : 'la escalera para bajar',
  }[accion] || accion
}
export const ACCIONES = ['mesa', 'marco', 'salida', 'ventana', 'persona']

// Guías oficiales textuales que NO califican: se usan como "un paso para hoy" en lenguaje simple.
export const GUIAS = {
  zona: { cita: 'Conserva la calma y ubícate en la zona de seguridad', fuente: 'CENAPRED, infografía "Actúa en caso de sismo" (durante)', url: 'https://www.cenapred.gob.mx/es/Publicaciones/archivos/258-INFOGRAFAENCASODESISMO.PDF' },
  menorRiesgo: { cita: 'Identifica las zonas de menor riesgo', fuente: 'CENAPRED, infografía "Actúa en caso de sismo" (antes)', url: 'https://www.cenapred.gob.mx/es/Publicaciones/archivos/258-INFOGRAFAENCASODESISMO.PDF' },
  planFamiliar: { cita: 'Es necesario incluir las necesidades de las personas con discapacidad y adultas mayores en los Programas de Protección Civil, Plan Familiar de Protección Civil y Planes de Contingencia', fuente: 'CENAPRED, gob.mx (26-may-2017)', url: 'https://www.gob.mx/cenapred/es/articulos/incluye-a-las-personas-adultas-mayores-y-a-las-personas-con-discapacidad-en-tu-plan-familiar?idiom=es' },
}

// estado: CONTRA (contradice una regla citada) | CONFORME (la cumple) | SIN_REGLA (no se califica)
export function evaluarAccion(config, accion) {
  const { nivel, pipc } = config || {}
  if (!ACCIONES.includes(accion)) return { estado: 'SIN_REGLA', nota: 'Acción desconocida.' }
  if (pipc === 'si') return { estado: 'SIN_REGLA', nota: 'Tu edificio tiene su propio plan: sigue ese plan, esta app no califica.' }
  if (accion === 'ventana') return { estado: 'CONTRA', regla: REGLAS.R1 }
  if (accion === 'salida') {
    if (nivel === 'p4') return { estado: 'CONTRA', regla: REGLAS.R2 }
    if (nivel === 'pb' || nivel === 'p1') return { estado: 'CONFORME', regla: REGLAS.R3 }
    return { estado: 'SIN_REGLA', nota: 'Zona gris: la regla dice "los primeros dos o tres pisos" y no aclara si cuenta la planta baja.' }
  }
  if (accion === 'mesa') {
    if (nivel === 'p4') return { estado: 'CONFORME', regla: REGLAS.R4 }
    return { estado: 'SIN_REGLA', nota: 'La regla citada sobre mesas es para pisos altos; en tu nivel también se permite salir.' }
  }
  if (accion === 'marco') return { estado: 'SIN_REGLA', nota: 'Ninguna regla citada aquí menciona el marco de la puerta.' }
  return { estado: 'SIN_REGLA', nota: 'Ninguna regla citada aquí califica ayudar a otra persona durante el sismo; tampoco lo prohíbe.' }
}

// ── Registros de ensayo ─────────────────────────────────────────────────────
// { n, tipo:'sin'|'con', hora, noche, avisoSeg, accion|null, segundos|null, segDesdeTemblor|null, salida, estado|null, reglaId|null, repeticion, fecha, demo }
export function resultadoDe(e) {
  if (e.salida) return 'SALIDA'
  if (!e.accion) return 'SIN_DECISION'
  return e.estado || 'SIN_REGLA'
}

export function debilidad(e) {
  const r = resultadoDe(e)
  if (r === 'CONTRA') return 4
  if (r === 'SALIDA') return 3
  if (r === 'SIN_DECISION') return 2
  const s = Number.isFinite(e.segundos) ? Math.max(0, e.segundos) : 0
  return s / (1 + s) // 0..1, más lento = más débil
}

export function elegirHora(config, usadas = [], rng = Math.random) {
  const horas = []
  for (let h = config.inicio; h < config.fin; h++) horas.push(h)
  const libres = horas.filter(h => !usadas.includes(h))
  const pool = libres.length ? libres : horas
  return pool[Math.floor(rng() * pool.length)]
}
export const esNoche = h => h >= 19 || h < 7

// Tres ensayos, nunca treinta: con/sin aviso en orden al azar; el tercero repite el más débil a otra hora.
export function siguienteEnsayo(historial, config, rng = Math.random) {
  const h = historial || []
  if (h.length >= 3) return null
  const usadas = h.map(e => e.hora)
  const hora = elegirHora(config, usadas, rng)
  if (h.length === 0) return { n: 1, tipo: rng() < 0.5 ? 'sin' : 'con', hora, noche: esNoche(hora), repeticion: false }
  if (h.length === 1) return { n: 2, tipo: h[0].tipo === 'sin' ? 'con' : 'sin', hora, noche: esNoche(hora), repeticion: false }
  const [a, b] = h
  const da = debilidad(a), db = debilidad(b)
  const peor = da === db ? (a.tipo === 'sin' ? a : b) : da > db ? a : b
  return { n: 3, tipo: peor.tipo, hora, noche: esNoche(hora), repeticion: true, repiteDe: peor.n }
}

const mediana = xs => {
  const v = xs.filter(Number.isFinite).sort((x, y) => x - y)
  if (!v.length) return null
  const m = Math.floor(v.length / 2)
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2
}
const tasa = (k, n) => (n ? k / n : 0)

// Congelarse y salir NUNCA se descartan: el denominador son todos los ensayos.
export function resumen(ensayos) {
  const e = ensayos || []
  const n = e.length
  const cuenta = r => e.filter(x => resultadoDe(x) === r).length
  const decisiones = t => e.filter(x => x.tipo === t && x.accion && !x.salida)
  return {
    n,
    sinDecision: cuenta('SIN_DECISION'), salidas: cuenta('SALIDA'), contra: cuenta('CONTRA'),
    tasaSinDecision: tasa(cuenta('SIN_DECISION'), n), tasaSalidas: tasa(cuenta('SALIDA'), n), tasaContra: tasa(cuenta('CONTRA'), n),
    medianaSin: mediana(decisiones('sin').map(x => x.segDesdeTemblor)),
    medianaCon: mediana(decisiones('con').map(x => x.segDesdeTemblor)),
  }
}

export const GRUPO_MINIMO = 11 // como la supresión de celdas de 1 a 10 (CMS); ningún grupo de 10 o menos se muestra

// personas: [{ ensayos: [...] }]
export function resumenGrupo(personas) {
  const n = (personas || []).length
  if (n < GRUPO_MINIMO) return { oculto: true, n, motivo: `Grupo de ${n}: con menos de ${GRUPO_MINIMO} personas un número puede señalar a alguien. No se muestra.` }
  const r = resumen(personas.flatMap(p => p.ensayos))
  let apuesta = 'Faltan datos para la prueba.'
  if (r.medianaSin != null && r.medianaCon != null) {
    apuesta = r.medianaSin - r.medianaCon >= 1
      ? 'Con aviso deciden antes del temblor que sin aviso: la escena sí distingue el caso 2017.'
      : 'Deciden igual de rápido sin aviso que con aviso: la escena NO está recreando 2017. La apuesta falla.'
  }
  return { oculto: false, n, ...r, apuesta }
}

// ── Lectura validada de localStorage ────────────────────────────────────────
const enLista = (v, lista) => lista.some(x => x.id === v)
const horaOk = v => Number.isInteger(v) && v >= 0 && v <= 23

export function validarConfig(c) {
  if (!c || typeof c !== 'object') return null
  const { ciudad: ci, nivel, pipc, intensidad, inicio, fin, permitirNoche } = c
  const cuida = c.cuida === undefined ? false : c.cuida
  if (!ciudad(ci) || !enLista(nivel, NIVELES) || !enLista(pipc, PIPC) || !enLista(intensidad, INTENSIDADES)) return null
  if (!horaOk(inicio) || !Number.isInteger(fin) || fin < 1 || fin > 24 || inicio >= fin) return null
  if (typeof permitirNoche !== 'boolean' || typeof cuida !== 'boolean') return null
  if (!permitirNoche && (inicio < 7 || fin > 22)) return null
  return { ciudad: ci, nivel, pipc, intensidad, inicio, fin, permitirNoche, cuida }
}

export function leerConfig(raw) {
  try { return validarConfig(JSON.parse(raw)) } catch { return null }
}

export function leerEnsayos(raw) {
  try {
    const v = JSON.parse(raw)
    if (!Array.isArray(v)) return []
    return v.filter(e => e && (e.tipo === 'sin' || e.tipo === 'con') && Number.isInteger(e.n) && e.n >= 1 && e.n <= 3
      && (e.accion === null || ACCIONES.includes(e.accion)) && typeof e.salida === 'boolean').slice(0, 3)
  } catch { return [] }
}

export const CONFIG_INICIAL = { ciudad: 'cdmx', nivel: 'p1', pipc: 'nose', intensidad: 'media', inicio: 10, fin: 20, permitirNoche: false, cuida: false }

// ── Resultado en lenguaje simple (prueba de persona: "SIN REGLA CITADA — no se califica" no le decía nada a Rosa) ──
const seg = x => Math.max(0, Math.round(Math.abs(x)))
export function tiempoTexto(e) {
  if (!e.accion || !Number.isFinite(e.segundos)) return null
  if (e.tipo === 'con' && e.segDesdeTemblor < 0) return `Decidiste ${seg(e.segundos)} segundos después de que sonó el tono, ${seg(e.segDesdeTemblor)} antes de que empezara a temblar.`
  if (e.tipo === 'con') return `Decidiste ${seg(e.segundos)} segundos después de que sonó el tono (${seg(e.segDesdeTemblor)} después de que empezó a temblar).`
  return `Decidiste ${seg(e.segDesdeTemblor)} segundos después de que empezó a temblar.`
}

export function explicacionSimple(e, config = {}) {
  const r = resultadoDe(e)
  const lugar = e.accion ? nombreAccion(e.accion, config.nivel) : null
  const extraCuida = config.cuida && e.accion !== 'persona' ? { texto: 'Vives con alguien que no puede moverse rápido: ¿quién lo acompaña en ese momento?', guia: GUIAS.planFamiliar } : null
  if (r === 'SALIDA') return { tono: 'SALIDA', titulo: 'Terminaste el ensayo antes de tiempo', texto: 'Se cuenta así; no se esconde. Si fue por miedo o incomodidad, puedes bajar la intensidad en Configurar.', guia: null, extra: null }
  if (r === 'SIN_DECISION') return {
    tono: 'SIN_DECISION', titulo: 'No alcanzaste a elegir a dónde ir',
    texto: `Le pasa a mucha gente: en el video de un sismo real (Christchurch, Nueva Zelanda, 2011), 1 de cada 3 personas se quedó inmóvil.${e.tipo === 'con' && e.avisoSeg > 0 ? ` En este ensayo tenías unos ${e.avisoSeg} segundos de aviso: tiempo para llegar a un lugar seguro de tu casa.` : ''}`,
    paso: 'Un paso para hoy: decide de antemano cuál es el lugar más seguro de tu casa, para no tener que pensarlo en el momento. Durante el sismo, la guía dice:',
    guia: GUIAS.zona, extra: extraCuida,
  }
  const regla = e.reglaId ? REGLAS[e.reglaId] : null
  if (r === 'CONTRA') return { tono: 'CONTRA', titulo: `Fuiste a ${lugar}: la guía oficial dice que no`, texto: 'Lo que dice la guía:', guia: regla, extra: extraCuida }
  if (r === 'CONFORME') return { tono: 'CONFORME', titulo: `Fuiste a ${lugar}: va de acuerdo con la guía oficial`, texto: 'Lo que dice la guía:', guia: regla, extra: extraCuida }
  // SIN_REGLA: sin jerga; decir por qué no hay calificación y dar un paso concreto
  if (config.pipc === 'si') return { tono: 'SIN_REGLA', titulo: `Fuiste a ${lugar}`, texto: 'Tu edificio tiene su propio plan de Protección Civil. Sigue ese plan: por eso aquí no te ponemos calificación.', guia: null, extra: extraCuida }
  if (e.accion === 'persona') return {
    tono: 'SIN_REGLA', titulo: 'Fuiste con la señora del sofá',
    texto: 'Las guías oficiales que usamos no dicen si eso está bien o mal, por eso no te ponemos calificación.',
    paso: 'Un paso para hoy: si en tu casa hay alguien que no puede moverse rápido, hagan juntos el plan familiar: quién lo acompaña y a qué lugar van. CENAPRED dice:',
    guia: GUIAS.planFamiliar, extra: null,
  }
  if (e.accion === 'salida') return { tono: 'SIN_REGLA', titulo: `Fuiste a ${lugar}`, texto: 'Tu piso está en una zona gris: la guía dice que se puede bajar por la escalera "en los primeros dos o tres pisos", y no aclara si cuenta la planta baja. Por eso no te ponemos calificación.', paso: 'Un paso para hoy: pregunta en tu edificio o a Protección Civil de tu alcaldía qué aplica en tu piso.', guia: null, extra: extraCuida }
  if (e.accion === 'mesa') return { tono: 'SIN_REGLA', titulo: 'Fuiste a la mesa', texto: 'En tu piso la guía permite salir; lo de resguardarse bajo mesas resistentes lo dice para pisos altos. Por eso no te ponemos calificación.', paso: 'Lo que dice la guía para pisos altos:', guia: REGLAS.R4, extra: extraCuida }
  return { tono: 'SIN_REGLA', titulo: `Fuiste a ${lugar}`, texto: 'Las guías oficiales que usamos no hablan del marco de la puerta, por eso no te ponemos calificación.', paso: 'Un paso para hoy: la guía pide, antes de que tiemble:', guia: GUIAS.menorRiesgo, extra: extraCuida }
}
