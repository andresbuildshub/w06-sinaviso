# Prompts — w06-sinaviso

Prompts worth keeping from this build. Raw material for the Week 12 Method.

## 1. Implementation prompt (packet → coding agent)

> Derived from docs/PACKET.md before writing code. Small testable features, acceptance criteria, commit plan.

```
Build "Sin Aviso" in the existing Next.js 15 (App Router, JS) + Tailwind 4 skeleton. Spanish UI, dark theme, mobile-first (390 px). No database, no auth, no API keys, nothing leaves the phone: all state in localStorage, validated on read. No camera, mic, GPS or accelerometer. Invented data labeled on screen.

F1 lib/ensayo.js (pure, no DOM) — the rules and the logic.
  - CIUDADES: capitals of the 11 SASMEX-loudspeaker states + Guadalajara, with lat/lon.
  - EPICENTRO_COSTA: 1st Simulacro Nacional 2026 hypothesis, M8.2, ~55 km NW of Acapulco (approx coords, labeled).
  - avisoSegundos(ciudadId): haversine km / 3.5 km/s − 20 s, min 0, rounded. Calibrated to "up to ~60 s for CDMX" (SASMEX). Labeled estimate, not official.
  - NIVELES: planta baja, piso 1, 2, 3, 4 o más. ACCIONES: mesa, marco, salida (stairs, or street door on planta baja), ventana, persona (the woman on the sofa).
  - REGLAS with verbatim quotes + source: R1 windows (CENAPRED infographic "Aléjate de ventanas y objetos que puedan caer"), R2 no evacuar desde pisos altos (Manual STCONAPRA via Infobae 17-feb-2026), R3 evacuar por escaleras permitido en los primeros dos o tres pisos (same source), R4 shelter "bajo trabes o mesas resistentes, lejos de ventanas" (same source, for upper floors).
  - evaluarAccion({nivel, pipc}, accion) → {estado: CONTRA|CONFORME|SIN_REGLA, regla?, nota}. PIPC "sí" → SIN_REGLA for everything ("manda el plan de tu edificio"). Piso 3 + salida → SIN_REGLA ("la regla dice dos o tres pisos").
  - puntuarEnsayo(e) → debilidad rank: CONTRA 4 > SALIDA 3 > SIN_DECISION 2 > else seconds scaled below 2.
  - siguienteEnsayo(historial, rng) → first two = {sin, con} in random order; third = repeat of the weaker tipo at a different hour; null after three.
  - resumen(ensayos) → counts and RATES of sin decisión, salidas, contra regla (denominator = all sessions, never dropping freezes/exits), median seconds con/sin aviso.
  - resumenGrupo(n, ...) → visible only if n ≥ 11.
  - leerConfig(raw) → validated config or null (closed lists, integer hours 0–23).
  AC: CDMX 55–62 s, Acapulco 0, Chilpancingo < 15; piso 4+salida → CONTRA R2; planta baja+salida → CONFORME R3; piso 3+salida → SIN_REGLA; ventana any floor → CONTRA R1; marco → SIN_REGLA; pipc sí → SIN_REGLA; weaker selection; freezes stay in denominator; group 7 hidden, 11 shown; bad localStorage → null.

F2 app/configurar — form (ciudad, nivel, pipc sí/no/no sé, hora inicio/fin, permitir noche off by default, intensidad suave/media/fuerte), live "≈ N s de aviso" card with the 2017 note, save to localStorage, "Borrar todo".
  AC: invalid hour range blocked; night hours unavailable unless toggled.

F3 components/Cuarto.js — three.js room (client only, dynamic import): floor, walls, window, table, doorway frame, exit (stairs or street door), sofa with a seated woman, hanging lamp, shelf objects that fall. Props: fase (calma|aviso|temblor|fin), intensidad, noche, nivel. Tap → raycast → onElegir(accion) once. Shake: camera jitter + room sway + lamp swing + falling objects; CSS shake fallback. Label "Simulación en pantalla · no es VR · temblor inventado".
  AC: renders on 390 px; tap on each object returns its accion; no tap while calma.

F4 app/ensayo — state machine: listo → espera al azar (knock: vibrate + banner + optional local Notification) → Empezar (unlock audio) → calma random 4–12 s → [con aviso: tone (3 soft notes, never SASMEX) then warning seconds of the city] → temblor 25 s (rumble + vibrate on Android) → fin. Clock zero = first cue (tone or first shaking frame). visibilitychange hidden during calma/aviso/temblor → SALIDA. No tap → SIN_DECISION. Save to localStorage; show short result; link to next rehearsal. ?demo=1 → all waits ÷4, labeled "MODO DEMO".
  AC: full rehearsal in demo mode saves exactly one record; third rehearsal type = siguienteEnsayo.

F5 app/resultados — cards per rehearsal: rule verdict (with quote + source) BEFORE seconds; rates block; "¿Tembló de verdad?" memory form (labeled RECUERDO, NO MEDICIÓN, stored locally); delete all.

F6 app/grupo — invented groups (7, 24, 38 people) through resumenGrupo: rates + medians con/sin aviso + the bet test sentence ("si deciden igual de rápido sin aviso que con aviso, la escena no recrea 2017"); <11 hidden. app/reglas — answer key with quotes, city warning table, what is simulated/invented, sources. Home page explains what it measures and what it doesn't.

Commit plan: (1) lib + tests, (2) configurar + layout + home, (3) Cuarto + ensayo, (4) resultados + grupo + reglas, deploy; then mechanical fixes, persona fix, docs.
```

## 2. Persona prompt (synthetic user test)

> Run in a fresh agent with no build context, on 23 phone screenshots of production (deploy #3). Full log in docs/PERSONA_test.md.

```
You are running a PERSONA USABILITY TEST for a university course project. Do NOT spawn any sub-agents, do NOT browse the web, and do NOT modify any files. Only read the screenshot images listed below, in order, then write your report. Write the whole report in Spanish.

Who you are: Doña Rosa Hernández, 61. You live in a self-built two-story house in Iztapalapa, Mexico City (old lake-bed zone). You take care of your mother, 84, who uses a walker and spends the day and sleeps on the ground floor. Since the September 2017 earthquake you are afraid of the topic. You have a Motorola Android that cost about MX$3,000; you use WhatsApp and Facebook and not much else. You read slowly, you don't know technical words, and when something doesn't make sense you don't ask — you just close it and leave, silently. Your granddaughter sent you this link ("Sin Aviso") and told you "abuela, practica lo del temblor".

Your tasks (as her, using only what the screens show):
1. Set up the rehearsal for your real situation (your house, your floor, your hours).
2. Do a rehearsal and decide, when the room shakes, where you would tap.
3. Understand your result: what did you do, was it right or wrong, and what does the screen want you to do next?
4. Find out whether anyone else (your granddaughter, the government, an insurer) can see your results.

[23 screenshots listed in order: inicio, configurar, instrucciones, esperando, aviso, cuarto en calma, cuarto temblando, después de tocar a la señora, resultado, ensayo 2 con tono de aviso y sin decisión, mis resultados]

What to write: 1. first-person narration screen by screen (hesitations, words she doesn't understand, where she taps); 2. numbered confusion log (# · screenshot · what confused her, exact words · severity BLOQUEA/FRENA/MENOR · what she would have needed); 3. each task: achieved yes / partly / no and why; 4. where she would have quit silently; 5. the single worst confusion and one concrete fix.
```
