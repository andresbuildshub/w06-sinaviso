# PERSONA TEST — Week 6 · w06-sinaviso · Andrés Álvarez Morphy Namnum (TECHNOLOGIST, T7)

URL: https://w06-sinaviso.vercel.app · repo: https://github.com/andresbuildshub/w06-sinaviso

## Quién fue el usuario sintético

**Doña Rosa Hernández**, 61 (persona inventada, construida desde la investigación de la semana: casa autoconstruida en zona de lago, Android de MX$3,000, miedo desde 2017). Vive en Iztapalapa en una casa de dos pisos y cuida a su mamá de 84, que usa andadera y pasa el día en planta baja. Usa WhatsApp y Facebook, lee despacio y se va sin decir nada cuando no entiende. Su nieta le mandó el link. Sus 4 tareas: (1) configurar el ensayo para su situación real; (2) hacer un ensayo y decidir a dónde ir cuando tiembla; (3) entender su resultado; (4) saber si alguien más ve sus resultados.

## Método

Dos pases, los dos sobre la URL viva.
1. **Mecánico:** el plan de prueba del packet (a–h) con `node --test` (7 pruebas, luego 8) sobre `lib/ensayo.js`, más Playwright contra producción a 390 px (rutas, desbordamiento, errores de consola, capturas de cada fase) y una **prueba de extremo a extremo**: 6 ensayos completos en `?demo=1`, en dos configuraciones, tocando los 5 lugares del cuarto. Las coordenadas del toque se calcularon proyectando la posición 3D de cada objeto con la misma cámara, así que la prueba verifica el raycasting y no un clic adivinado.
2. **Persona:** un agente nuevo, sin contexto del build, con el prompt de persona (en `docs/PROMPTS.md`). Recorrió 23 capturas de teléfono de producción (deploy #3) en el orden en que Rosa las vería: inicio, configurar, instrucciones, espera, aviso, cuarto en calma, cuarto temblando, resultado tras tocar a la señora, segundo ensayo con tono de aviso y sin decisión, y mis resultados. Instrucción: narrar en primera persona, registrar cada confusión con severidad y decir dónde se rendiría. Por decisión de tiempo **no hubo re-prueba** sobre el deploy corregido.

## Pase 1 · Prueba mecánica

| Prueba | Resultado |
|---|---|
| a) CDMX 55–62 s, Acapulco 0, Chilpancingo < 15 | OK (CDMX 58, Acapulco 0, Chilpancingo 5) |
| b) Piso 4+ y salida → CONTRA R2; planta baja → CONFORME R3; piso 3 → sin regla | OK (unitaria y de extremo a extremo) |
| c) Ventana → CONTRA R1 en cualquier nivel; marco → sin regla; con plan del edificio nada se califica | OK |
| d) El tercer ensayo repite el más débil a otra hora | OK en unitaria y en producción (A: empate CONTRA/CONTRA → repite "sin aviso"; B: el más lento → repite "con aviso") |
| e) Sin decisión y salidas quedan en el denominador | OK |
| f) Grupo de 7 oculto, de 11 visible | OK (unitaria; en /grupo el despacho de 7 aparece oculto) |
| g) localStorage corrupto o fuera de lista → se ignora | OK |
| h) Producción: 6 rutas 200, 404 en ruta inexistente, 390 px sin scroll horizontal, sin errores de consola | OK |
| Ensayo completo en `?demo=1` guarda un registro | **En la captura del deploy #2 el cuarto seguía en blanco a los 0.7 s de "Empezar": la carga de three.js se comía la calma → BUG 1** |
| Los 5 lugares se pueden tocar a 390 px | **La señora del sofá y la salida quedaban fuera de la pantalla → BUG 2** |
| La escalera se ve | **El piso era una sola losa y tapaba la escalera → BUG 3** |
| Configurar con Playwright por nombre accesible | **Los botones Sí/No dentro de un `<label>` perdían su nombre ("Sí" leía la pregunta entera) → BUG 4** |
| De extremo a extremo tras las correcciones (deploy #4): 6 ensayos, 5 lugares | OK, mismos resultados que antes y 0 errores de consola |

**Correcciones:** BUG 1: el reloj de calma arranca cuando el cuarto avisa que ya dibujó su primer cuadro, y three.js se precarga al tocar el botón de espera (deploy #3). BUG 2: el cuarto se reacomodó, con sofá y escalera dentro del campo visual y la puerta a la calle en la pared del fondo (deploy #3). BUG 3: el piso se construye alrededor del hueco de la escalera (deploy #3). BUG 4: fieldset/legend y `aria-pressed` (deploy #5).

## Pase 2 · Persona (Doña Rosa) — registro completo del agente

# Prueba de usabilidad: Doña Rosa Hernández (61 años, Iztapalapa)

**Límites de esta prueba:** las capturas son fijas. Con ellas no puedo juzgar la animación, el sonido real, el tamaño de las zonas que se pueden tocar, cómo corre en un Motorola barato, ni si la pantalla se apaga mientras espera. Donde imagino algo que la captura no muestra, lo marco como *[interpretación]*.

---

## 1. Narración en primera persona

**01 · Inicio (arriba).** Mi nieta me mandó esto por WhatsApp. Arriba hay un montón de palabras juntas: "Configurar, Ensayar, Mis resultados, Grupo, Reglas". No sé cuál es para mí y no toco ninguna. En grande dice "Ensaya el sismo que no avisa". Luego leo "El 19 de septiembre de 2017, en la Ciudad de México, la alerta sonó **después** de que empezó a temblar". Se me aprieta el pecho, porque yo estaba aquí ese día. "Aquí ensayas los dos casos": ¿cuáles dos casos? Creo que con alerta y sin alerta.
- Cuadro 1: "Con tu ciudad calculamos cuántos segundos de aviso tendrías". Eso más o menos lo entiendo.
- Cuadro 2: "**Tres ensayos, nunca treinta**". ¿Treinta? ¿Quién dijo treinta? No le entiendo. Luego dice "El tercero repite el que te salió peor", o sea que sí me van a calificar.
- Cuadro 3: "si tu decisión contradice una regla oficial". ¿Cuál regla? Nadie me ha enseñado ninguna. Lo de "Solo tú los ves" sí me tranquiliza.

**02 · Inicio (abajo).** "No usa cámara, micrófono ni ubicación. Tus resultados se quedan en este teléfono." Bueno. "(no es VR)": no sé qué es VR. Abajo, en letra gris que casi no leo, dice "proyecto de curso de Andrés Álvarez Morphy (Crystal Ball Studio, semana 6)". ¿Es la tarea de un muchacho? Entonces no es de Protección Civil. Me da desconfianza, pero me lo mandó mi nieta. Toco el primer botón amarillo, "Configurar", porque tiene el 1.

**03 · Configurar (arriba).** Ciudad: ya dice Ciudad de México. Luego viene un cuadro amarillo con un número enorme: "**≈ 58 segundos** de aviso". No sé qué es esa rayita ondulada (≈), pero entiendo que tengo 58 segundos. ¡Casi un minuto! Con eso sí alcanzo a sacar a mi mamá. La letra chica de abajo ("Estimación simple por distancia (273 km) a una hipótesis oficial de simulacro (1er Simulacro Nacional 2026 (6-may-2026)… No es el cálculo de la alerta sísmica…") no la leo: son muchos números, paréntesis, "hipótesis", "estimación". *[El aviso de que en 2017 la alerta llegó tarde está justo en la letra que ella no lee. Se queda con el 58.]*

"¿En qué **nivel** vas a ensayar?" ¿Nivel? Ah, el piso. "Cambia qué dice la regla sobre salir o quedarte." Otra vez "la regla", y no me dicen qué dice. Mi mamá pasa el día abajo, así que dejo "Planta baja".

"¿Tu **edificio** tiene **Programa Interno de Protección Civil**?" Yo no vivo en edificio, vivo en mi casa, la construimos nosotros. No sé qué es "Programa Interno". "Si lo tiene y dice qué hacer, **manda su plan**": ¿mandarlo a quién? ¿Tengo que mandar un papel? Aquí me quedo parada un rato. Como ya dice "No sé", lo dejo así.

Me doy cuenta de que en ningún lado me pregunta lo más importante: que vivo con mi mamá de 84 años, que usa andadera.

**04 · Configurar (abajo).** "10:00 a 20:00": las 20:00 son las 8 de la noche, lo saco contando. "**No te observa** para elegirlo": ni se me había ocurrido que me pudiera observar, y ahora me preocupa. "Permitir ensayos de noche (apagado de inicio: tus horas de dormir no se tocan)": "apagado de inicio" no lo entiendo y no lo toco. Aunque lo que más miedo me da es que tiemble de noche con mi mamá dormida abajo. En Intensidad dice "Media" y lo dejo. Toco "Guardar y ensayar". Justo debajo veo "**Borrar todo lo guardado en este teléfono**". ¡Ay no! ¿Me va a borrar mis fotos y mis WhatsApp? Me alejo de ese botón.

**05 · Ensayo 1, instrucciones.** "Imagina que son las 14:00. Estás en la sala, en planta baja, con una señora mayor sentada en el sofá." Como mi mamá. ¿Cómo sabe, si no le dije? Me da gusto y me da cosa.
- "Lo único sorpresa es cuándo": está raro dicho, pero entiendo que me va a avisar.
- "Si tiembla, **toca en el cuarto el lugar a donde vas**. Una sola vez." ¿Tocar en el cuarto? ¿Me tengo que ir a parar a algún lugar de mi casa? Lo leo dos veces y creo que es en la pantalla.
- "Puedes **salir** cuando quieras. Salir también se cuenta." ¿Salir de la casa? En los simulacros siempre dicen que salgamos. No sé si salir está bien o mal.
- "SIMULADO: en la **versión completa**…": ¿esta no está completa? ¿Hay que pagar? Ya no sigo leyendo.

Toco "Estoy listo" (dice "listo", no "lista").

**06.** Pantalla negra. No hay nada.

**07 · Esperando.** "Esperando el aviso… Puedes dejar el teléfono a un lado. Deja esta página abierta." No hay reloj y nada se mueve. ¿Cuánto espero? Mi teléfono apaga la pantalla solito. Si lo dejo y se apaga, ¿sigue funcionando? Aquí casi lo cierro, pensando que se trabó. *[No puedo verificar si la página mantiene la pantalla encendida.]*

**08 · Aviso.** "Es un ensayo de sismo. Sube el volumen. Cuando estés lista, toca Empezar." Esto sí está claro, y me calma que diga que es ensayo. Subo el volumen y toco "Empezar".

**09 · Cuarto en calma.** Veo un cuarto de dibujo: un sillón rojo, una señora sin cara, una mesa, una ventana, una puerta verde, otra puerta oscura y una cosa gris junto al sillón que no sé qué es (¿una tabla? ¿la andadera?). Abajo dice "14:00 · un día normal en tu sala". No me dice qué puedo tocar ni cuánto hay que esperar, y mi sala no se parece. Espero con el dedo listo.

**10 · Temblando.** Se caen las cosas de la repisa y el foco se columpia. Se me acelera el corazón como en 2017. "Está temblando. Toca a dónde vas." Dudo un segundo entre la puerta verde (en el simulacro siempre dicen "sal") y la señora. Pero mi mamá no puede salir rápido con su andadera, y yo no la dejo sola. **Toco a la señora.** *[La figura es chica y se mueve, así que a unos dedos lentos les puede costar atinarle; en una imagen fija no se puede comprobar.]* Abajo veo "**Salir** del ensayo (cuenta como salida)". Yo no lo toqué, pero en el susto "Salir" es justo lo que enseña el simulacro. Pude haberlo tocado creyendo que era "salirme de la casa".

**11 · Después de tocar.** El sillón y la señora se ponen naranjas. "Elegiste la señora del sofá. **Quédate hasta que termine**." ¿Quedarme con ella? Siento que me dice que hice bien y me da alivio. ¿O quiere decir que me quede viendo la pantalla? No sé. Espero.

**12 · Resultado 1.** "Este ensayo era SIN AVISO. Como el 19 de septiembre de 2017…" Otra vez 2017. "Tocaste la señora del sofá": sí.
"**SIN REGLA CITADA — no se califica.** Ninguna regla citada aquí califica ayudar a otra persona durante el sismo; tampoco lo prohíbe." Lo leo tres veces. ¿"Citada"? ¿Entonces no está ni bien ni mal? ¿Y qué hago con mi mamá? Es lo único que quería saber y no me lo dice. Hace un momento me dijo "quédate" y ahora me dice que no sabe.
"Tardaste **3.1 s** en decidir desde la **primera señal**." ¿Tres segundos? ¿Es mucho o poco? ¿Cuál señal, si no sonó nada?
El único botón es "Siguiente ensayo (2 de 3)". No aprendí nada y estoy más asustada. Lo toco porque mi nieta me pidió que practicara.

**13.** Negro.

**14–17 · Ensayo 2.** Es lo mismo, pero a las 11:00, y ya no lo leo todo. Me quedo con "Una sola vez": ¿una vez en todo o en cada ensayo? Yo ya toqué en el primero… Otra vez espero sin saber cuánto (15), toco "Empezar" (16) y veo el cuarto quieto (17).

**18 · Suena el tono.** Suenan tres notitas suaves. "¡Suena el tono de aviso! Toca a dónde vas." Pero nada se mueve. La alerta que yo conozco es la sirena fuerte que dice "alerta sísmica", no unas campanitas. Además las instrucciones decían "**Si tiembla**, toca", y no está temblando, así que espero a que tiemble. Pasan casi 58 segundos con el cuarto quieto. Se me hace eterno. Pienso que se trabó, volteo a ver a mi mamá o se apaga la pantalla. *[Interpretación: la captura solo confirma que no tocó nada.]*

**19 · Temblando.** Cuando vuelvo a ver, ya está temblando. Ahora sí dudo: con casi un minuto de aviso, ¿debía sacar a la señora? ¿Irme a la puerta? La vez pasada tocar a la señora "no se calificó", a lo mejor estuvo mal. Entre que sí y que no, se acaba el temblor. No toco nada.

**20 · Resultado 2.** "Este ensayo era CON AVISO (58 s)." Entonces las campanitas eran la alerta. "**SIN DECISIÓN DURANTE EL SISMO** — no tocaste ningún lugar antes de que terminara." En mayúsculas, como regaño. Me congelé, que es justo lo que me da miedo que me pase de verdad. ¿Y qué debía hacer con mi mamá en 58 segundos? No lo dice. Solo hay "Siguiente ensayo (3 de 3)". **Aquí cierro la página** y no le digo nada a mi nieta.

**21.** Negro.

**22 · Mis resultados.** *[Sola no habría llegado aquí: ninguna pantalla de resultado lleva a esta página. Habría tenido que usar el menú de arriba.]* "Solo están en este teléfono. **Nadie más los ve**." Eso lo entiendo: ni mi nieta, ni el gobierno, ni nadie. Luego se repite lo de antes. Abajo dice "Contradijiste una regla citada: 0 (0%) · Sin decisión durante el sismo: 1 (50%) · **Salidas: 0 (0%)**". ¿El cero es bueno? ¿"Salidas: 0" quiere decir que no me salí de la casa y eso está mal? No manejo porcentajes. "No se quitan para que el resultado se vea mejor": no le entendí.

**23 · Mis resultados (abajo).** "**¿Tembló de verdad?**" Me brinca el corazón: ¿está temblando? Ah, no, pregunta por un temblor de antes. "Cuéntate qué hiciste": ¿contármelo a mí misma? "¿Cuántos segundos tardaste en decidir?" En 2017 nadie contó segundos. No lleno nada. Otra vez aparece "Borrar todo lo guardado en este teléfono" y no lo toco ni de chiste. Arriba dice "Grupo": ¿si entro ahí mi nieta ve lo mío? No entro.

---

## 2. Registro de confusiones

| # | Captura | Qué la confundió | Severidad | Qué habría necesitado |
|---|---|---|---|---|
| 1 | 01 | Menú de cinco palabras sin explicar ("Grupo", "Reglas"); nunca lo usa | MENOR | Un solo camino guiado. Si existe "Grupo", decir que no comparte resultados |
| 2 | 01 | "Tres ensayos, nunca treinta" | MENOR | "Son solo 3 ensayos cortos" |
| 3 | 01, 03 | "contradice una regla oficial", "Cambia qué dice la regla sobre salir o quedarte": nunca le enseñan la regla | FRENA | Mostrar la regla en palabras simples ahí mismo |
| 4 | 01 vs 12 | "repite el que te salió peor" promete calificación; luego dice "no se califica" | FRENA | Decir qué es "peor" (por ejemplo, "el que más tardaste") |
| 5 | 02 | "no es VR", "Crystal Ball Studio", "proyecto de curso" | MENOR | Sin siglas ni inglés: "Es un ejercicio escolar, no es de Protección Civil" |
| 6 | 03 | "≈ 58 segundos" enorme; la advertencia de 2017 y "No es el cálculo de la alerta sísmica" en letra gris chica | FRENA (se lleva una idea falsa) | Advertencia del mismo tamaño: "Podrías tener 58 segundos… o ninguno, como en 2017" |
| 7 | 03 | "Estimación simple por distancia (273 km) a una hipótesis oficial de simulacro (1er Simulacro Nacional 2026 (6-may-2026)…" | FRENA | Una frase corta, sin paréntesis ni kilómetros |
| 8 | 03 | "¿En qué nivel vas a ensayar?" | MENOR | "¿En qué piso pasas más tiempo?" |
| 9 | 03 | "¿Tu edificio tiene Programa Interno de Protección Civil?": vive en casa autoconstruida y no conoce el término | FRENA | Preguntar antes "¿Casa o edificio?" y ocultar esto si es casa |
| 10 | 03 | "manda su plan": lo entiende como "enviar un plan" | FRENA | "Si tu edificio ya tiene plan, sigue ese plan" |
| 11 | 03–04 | Nada pregunta con quién vive, por alguien con andadera ni por la casa de dos pisos | FRENA (la configuración queda incompleta) | "¿Vives con alguien que no puede moverse rápido?", y usarlo en ensayos y resultados |
| 12 | 04 | "No te observa para elegirlo" | MENOR | Quitarlo: provoca la sospecha que quiere evitar |
| 13 | 04 | "(apagado de inicio: tus horas de dormir no se tocan)" | MENOR | "¿Quieres ensayos también de noche? Normalmente no" |
| 14 | 04, 23 | "Borrar todo lo guardado en este teléfono": teme perder fotos y WhatsApp | FRENA | "Borrar mis ensayos (tus fotos y mensajes no se tocan)" |
| 15 | 05, 14 | "toca en el cuarto el lugar a donde vas": ¿en la pantalla o caminando en su casa? | FRENA | "Toca con el dedo, en el dibujo, a dónde irías" |
| 16 | 05, 09–11, 17–19 | "Salir" tiene dos sentidos: "Salir del ensayo (cuenta como salida)"; en el simulacro "salir" es evacuar | FRENA (a otra persona la haría abandonar el ensayo por error) | "Terminar ensayo" o "Cerrar", nunca "Salir" |
| 17 | 05, 14 | "SIMULADO: en la versión completa…": ¿hay que pagar? | MENOR | "Hoy el aviso llega en menos de un minuto" |
| 18 | 05, 08, 03 | "Estoy listo" vs "estés lista"; "Lo único sorpresa"; "costa de guerrero" en minúscula | MENOR | Corregir |
| 19 | 07, 15 | "Esperando el aviso…" sin reloj ni movimiento; "Puedes dejar el teléfono a un lado" en un Android que apaga la pantalla | FRENA (puede bloquear; no verificable) | "Llega en menos de 1 minuto", algo que se mueva y pantalla siempre encendida |
| 20 | 09 | No se sabe qué se puede tocar; objeto gris sin identificar; dos puertas sin decir cuál da a la calle | FRENA | Etiquetas ("puerta a la calle") y un cuarto parecido a su casa |
| 21 | 10, 19 | Figuras chicas y en movimiento para dedos lentos (no verificable) | FRENA (riesgo) | Zonas grandes, o una lista con texto como respaldo |
| 22 | 11 | "Quédate hasta que termine": lo lee como aprobación de quedarse con la señora, y la pantalla 12 lo contradice | FRENA | "Ya elegiste. Espera a que pare el temblor" |
| 23 | 12 | "SIN REGLA CITADA — no se califica. Ninguna regla citada aquí califica ayudar a otra persona durante el sismo; tampoco lo prohíbe." | **BLOQUEA** (tarea 3) | Lenguaje simple y un paso concreto para quien cuida a alguien (ver sección 5) |
| 24 | 12 | "Tardaste 3.1 s… desde la primera señal": decimal, "s", sin comparación, y "señal" cuando no sonó nada | FRENA | "Tardaste 3 segundos en decidir", con una referencia de si es mucho o poco |
| 25 | 12, 20 | "Como el 19 de septiembre de 2017…": revive el trauma sin ninguna contención | FRENA | Tono cuidadoso y opción de pausar |
| 26 | 18 | Tres notas suaves que no se parecen a la alerta sísmica que ella conoce (sirena con voz) | FRENA | Un sonido parecido a la alerta, o explicar antes cómo suena |
| 27 | 05 vs 18 | La instrucción dice "Si tiembla, toca", pero en 18 suena el tono sin temblor: espera, y pasan 58 s con el cuarto quieto | **BLOQUEA** (causa probable de "sin decisión") | "Cuando suene el tono **o** empiece a temblar, toca…", y una cuenta regresiva visible |
| 28 | 20 | "SIN DECISIÓN DURANTE EL SISMO" en mayúsculas, sin decir qué hacer con 58 s | **BLOQUEA** (aquí se va) | Sin regaño: "Te congelaste; le pasa a mucha gente. Con casi un minuto, la guía dice…" |
| 29 | 12, 20 | Ningún resultado lleva a "Mis resultados"; solo hay "Siguiente ensayo" | FRENA | Botón "Ver mis resultados" |
| 30 | 22 | "Contradijiste una regla citada: 0 (0%)", "Salidas: 0 (0%)", "no se quitan para que el resultado se vea mejor" | FRENA | Una frase humana: "Nunca fuiste contra la guía. Una vez no decidiste a tiempo" |
| 31 | 23 | Título "¿Tembló de verdad?" la asusta; "Cuéntate qué hiciste"; le piden segundos de un recuerdo | FRENA | "¿Te ha tocado un sismo de verdad? Cuéntanos qué hiciste, si quieres", sin pedir segundos |
| 32 | Todas | Lo importante va en gris chico sobre negro, difícil de leer en un teléfono barato y al sol | FRENA | Más contraste y tamaño para las advertencias clave |

---

## 3. Tareas

1. **Configurar el ensayo para su situación real: A MEDIAS.** Quedaron ciudad, planta baja y horario, casi todo por defecto y sin entenderlo del todo. La app no le deja decir lo que define su caso: su mamá de 84 años con andadera, que vive en casa de dos pisos y no en "edificio", y dónde está cada una. La pregunta del Programa Interno no aplica a su casa. Además se lleva una idea peligrosa: "tengo 58 segundos".
2. **Ensayar y decidir: A MEDIAS.** En el ensayo 1 sí decidió: tocó a la señora en 3.1 s, que es lo que haría de verdad (ir por su mamá). En el ensayo 2 no: no reconoció el tono, la instrucción decía "si tiembla", esperó 58 s sin que pasara nada y dudó por el "no se califica" anterior. Se congeló.
3. **Entender su resultado: NO.** Sabe qué tocó, pero no si estuvo bien o mal: "no se califica" está en jerga y no responde su pregunta. No sabe si 3.1 s es bueno. "SIN DECISIÓN" la hace sentir regañada. Lo único que la pantalla le pide es "Siguiente ensayo", sin lección ni paso concreto.
4. **Saber quién ve sus resultados: SÍ.** Es lo más claro de toda la app y se repite en 01, 02, 03 y 22 ("Solo tú los ves", "Nadie más los ve"). Quedan dudas menores: "Grupo" en el menú, "proyecto de curso de Andrés…" y el botón de "Borrar todo". No nombra al gobierno ni a aseguradoras, pero "nadie más" le basta.

---

## 4. Dónde se habría ido sin decir nada

- **Punto de salida más probable: pantalla 20.** Después de congelarse, lee "SIN DECISIÓN DURANTE EL SISMO" en mayúsculas y nada le dice qué hacer. Se siente fracasada y cierra. No hace el ensayo 3 ni llega sola a "Mis resultados".
- **Riesgos antes de eso:**
  - **07 y 15:** espera sin señal de vida, y si su Android apaga la pantalla puede pensar que se trabó.
  - **18:** casi un minuto con el cuarto quieto después de unas campanitas que no reconoce.
- **Pantalla 12:** estuvo cerca de irse al leer "no se califica". Siguió solo porque obedece al botón amarillo y porque su nieta se lo pidió.

---

## 5. La peor confusión y cómo arreglarla

**Pantalla 12: "SIN REGLA CITADA — no se califica. Ninguna regla citada aquí califica ayudar a otra persona durante el sismo; tampoco lo prohíbe."**

Rosa usó la app por una sola razón: saber qué hacer con su mamá cuando tiemble. Hizo exactamente eso en el ensayo, y la app le contesta en jerga ("citada", "califica") que no tiene nada que decirle. Justo antes, en la 11, le había dicho "Quédate", así que la respuesta además se contradice. Esa falta de respuesta es lo que la hace dudar y congelarse en el ensayo 2, y es la razón de fondo por la que se va en la 20. La configuración nunca preguntó por su mamá, así que el hueco empieza desde la pantalla 03.

**Recomendación concreta:**
1. **En la configuración (03)**, agregar: "¿Vives con alguien que no puede moverse rápido? (andadera, silla de ruedas, bebé)". Si la respuesta es sí, el ensayo debe contar eso: "tu mamá está en el sofá con su andadera".
2. **Reescribir el resultado** en palabras simples, por ejemplo: "Fuiste con la señora. Las guías oficiales que usamos no dicen si eso está bien o mal, por eso no te ponemos calificación. Esto sí te sirve: haz hoy un plan con tu familia sobre quién acompaña a tu mamá y dónde se quedan."
3. **Poner debajo un solo botón claro**, como "Qué hacer si cuidas a alguien que usa andadera", que lleve a una fuente oficial citada (por ejemplo, el Plan Familiar de Protección Civil o Protección Civil de la alcaldía).

**Pendiente de verificar:** no comprobé qué dicen las guías oficiales de la CDMX sobre quienes cuidan a personas con movilidad reducida. El equipo tiene que confirmarlo antes de escribir ese texto. Si no existe una regla oficial, hay que decirlo así de claro, sin palabras como "citada".

## Qué se corrigió (deploy #4) y qué no

**La peor confusión (#23):** el resultado tras ir con la señora decía "SIN REGLA CITADA — no se califica", justo cuando Rosa quería saber qué hacer con su mamá. **Corrección:** todos los resultados se reescribieron en lenguaje simple (`explicacionSimple()` en `lib/ensayo.js`, con prueba unitaria que prohíbe la jerga). Cada resultado dice qué hiciste, si va contra la guía oficial, por qué no hay calificación cuando no la hay, y **un paso para hoy con cita textual**. Para quien va con la señora se cita a CENAPRED: *"Es necesario incluir las necesidades de las personas con discapacidad y adultas mayores en los … Plan Familiar de Protección Civil"* (gob.mx, 26-may-2017). Además se agregó la pregunta **"¿Vives con alguien que no puede moverse rápido?"**, que cambia el texto del ensayo y agrega "¿quién lo acompaña?" a los demás resultados.

| # | Severidad | Corrección |
|---|---|---|
| 27 | BLOQUEA | Instrucción "**En cuanto suene el tono o empiece a temblar**, toca con el dedo, en el dibujo…"; durante el aviso, "Sonó el tono: todavía no tiembla. Toca a dónde irías."; botón "Escuchar el tono" en las instrucciones. **Sin cuenta regresiva:** la alerta real no dice cuándo empieza a temblar. |
| 28 | BLOQUEA | "SIN DECISIÓN DURANTE EL SISMO" → "No alcanzaste a elegir a dónde ir. Le pasa a mucha gente (Christchurch: 1 de cada 3 se quedó inmóvil)", con los segundos de aviso que tenía y la guía de CENAPRED "Conserva la calma y ubícate en la zona de seguridad" |
| 6, 7 | FRENA | "unos 58 segundos de aviso… **…o ninguno, como el 19 de septiembre de 2017**", al mismo tamaño; letra chica en una sola frase |
| 9, 10 | FRENA | "¿Casa o edificio?" con opción "Vivo en casa"; "manda su plan" → "sigue ese plan" |
| 11 | FRENA | Pregunta por quien no puede moverse rápido (ver arriba) |
| 14 | FRENA | "Borrar mis ensayos de esta app (tus fotos y mensajes no se tocan)" |
| 15 | FRENA | "toca con el dedo, en el dibujo" |
| 16 | FRENA | "Salir del ensayo" → "Terminar el ensayo ahora"; en resultados, "Terminaste el ensayo antes de tiempo" |
| 19 | FRENA | "Llega en menos de un minuto", punto animado y la pantalla se mantiene encendida (Wake Lock) |
| 20, 21 | FRENA | Leyenda del cuarto en calma ("la puerta verde a la calle", "la señora con andadera") y zonas de toque invisibles más grandes para la señora y la salida (de extremo a extremo sigue en verde) |
| 22 | FRENA | "Ya elegiste: … Espera a que pare el temblor." |
| 24 | FRENA | "Decidiste 3 segundos después de que empezó a temblar. Todavía no hay datos para decir si es mucho o poco." |
| 29 | FRENA | Botón "Ver mis resultados" en cada resultado |
| 30, 31 | FRENA | Resumen en frases ("Ninguna vez fuiste contra la guía oficial"); "¿Te ha tocado un sismo de verdad?", segundos opcionales |
| 2, 5, 12, 13, 17, 18 | MENOR | "Solo 3 ensayos cortos"; "no es realidad virtual"; pie "Ejercicio escolar… no es de Protección Civil"; sin "no te observa"; "¿También de noche?"; SIMULADO en palabras simples; botones sin género |

**No se corrigió esta semana:**
- **#26 (el tono no se parece a la alerta real):** es una decisión de diseño. Imitar el sonido SASMEX está sancionado en simulacros de la CDMX y enseñaría que la alerta real puede ser un ensayo. Se mitigó con el botón "Escuchar el tono".
- **#25 (revivir 2017):** se suavizó el texto y se dice que se puede terminar cuando quiera; no hay pausa dentro del temblor.
- **#1 (menú de cinco palabras):** sin cambio.
- **#32 (contraste general):** solo se subió el contraste de las ayudas y los resultados.
- **Sin re-prueba de la persona** sobre el deploy corregido. La prueba mecánica de extremo a extremo sí se repitió.
