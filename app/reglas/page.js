import { REGLAS, CIUDADES, EPICENTROS, avisoCiudad, VEL_ONDA_S, RETRASO_ALERTA, VERSION, GRUPO_MINIMO } from '../../lib/ensayo.js'

const CALIFICA = [
  ['Ventana', 'Contradice R1 en cualquier nivel.'],
  ['Salida (escalera o puerta a la calle)', 'Planta baja y piso 1: de acuerdo con R3. Pisos 2 y 3: zona gris, no se califica (la regla dice "dos o tres pisos" y no aclara si cuenta la planta baja). Piso 4 o más: contradice R2.'],
  ['Mesa', 'Piso 4 o más: de acuerdo con R4. Otros niveles: no se califica.'],
  ['Marco de la puerta', 'No se califica: ninguna regla citada aquí lo menciona.'],
  ['La señora del sofá', 'No se califica: ninguna regla citada aquí califica ayudar a otra persona durante el sismo.'],
  ['Si tu edificio tiene Programa Interno', 'Nada se califica: manda el plan de tu edificio.'],
]

export default function Reglas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reglas y fuentes</h1>
        <p className="mt-1 text-sm text-stone-400">{VERSION}. La app no inventa reglas: solo califica con citas oficiales textuales.</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Las reglas citadas</h2>
        {Object.values(REGLAS).map(r => (
          <div key={r.id} className="rounded-xl border border-stone-800 p-3 text-sm">
            <p><b className="text-amber-400">{r.id}</b> “{r.cita}”</p>
            <p className="mt-1 text-xs text-stone-400"><a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.fuente}</a></p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Cómo se califica cada lugar</h2>
        <ul className="space-y-2 text-sm">
          {CALIFICA.map(([a, b]) => <li key={a} className="rounded-lg bg-stone-900 p-3"><b>{a}:</b> <span className="text-stone-300">{b}</span></li>)}
        </ul>
        <p className="text-xs text-stone-500">Primero se muestra si tu decisión contradice una regla y después el tiempo, para que una decisión rápida pero contraria a una regla no parezca un buen resultado.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Segundos de aviso por ciudad (estimación)</h2>
        <p className="text-sm text-stone-300">
          Aviso ≈ distancia al epicentro hipotético oficial más cercano ÷ {VEL_ONDA_S} km/s (onda S) − {RETRASO_ALERTA} s (supuesto de detección y difusión).
          Calibrado a "hasta ~60 s para la Ciudad de México" (SASMEX). <b>No es el cálculo oficial</b>, y la alerta solo suena si se espera un sismo fuerte.
          En sismos intraplaca como el de 2017 la alerta puede llegar tarde o no llegar: por eso existe el ensayo sin aviso.
        </p>
        <div className="overflow-hidden rounded-xl border border-stone-800">
          <table className="w-full text-sm">
            <thead className="bg-stone-900 text-left text-xs text-stone-400"><tr><th className="p-2">Ciudad</th><th className="p-2">Sismo hipotético</th><th className="p-2 text-right">Aviso</th></tr></thead>
            <tbody>
              {CIUDADES.map(c => { const a = avisoCiudad(c.id); return (
                <tr key={c.id} className="border-t border-stone-800"><td className="p-2">{c.nombre}</td><td className="p-2 text-stone-400">{a.epicentro.nombre} ({a.km} km)</td><td className="p-2 text-right font-semibold">{a.segundos} s</td></tr>
              ) })}
            </tbody>
          </table>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-xs text-stone-500">
          {EPICENTROS.map(e => <li key={e.id}>{e.nombre}: {e.fuente}. Coordenadas aproximadas.</li>)}
        </ul>
      </section>

      <section className="space-y-2 text-sm text-stone-300">
        <h2 className="text-lg font-semibold text-stone-100">Qué es simulado, inventado o no medido</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li><b>El temblor es inventado:</b> 25 segundos, forma y fuerza no vienen de un registro real. Falta calibrarlo con registros acelerográficos reales.</li>
          <li><b>Es una simulación en pantalla, no VR.</b> Un celular en la mano no da la sensación de estar ahí como un visor.</li>
          <li><b>El aviso a una hora al azar es simulado:</b> aquí llega después de tocar "Estoy listo".</li>
          <li><b>No mide conducta.</b> En un sismo real la gente hace otras cosas: en video del sismo de Christchurch 2011, 34% se quedó inmóvil y 12% se agachó y cubrió. Esta app mide cuánto tardas en decidir en un ensayo.</li>
          <li><b>El tono de aviso no es el sonido de la alerta sísmica.</b> Usar ese sonido en simulacros está sancionado en la CDMX, y enseñaría que la alerta real puede ser un ensayo.</li>
          <li><b>La vista de grupo usa datos inventados</b> y oculta cualquier grupo de menos de {GRUPO_MINIMO} personas.</li>
          <li><b>Sin cámara, micrófono, ubicación ni acelerómetro.</b> Todo se guarda solo en tu teléfono.</li>
        </ul>
      </section>

      <section className="space-y-1 text-xs text-stone-500">
        <h2 className="text-sm font-semibold text-stone-300">Fuentes</h2>
        <p><a className="underline" href="https://www.cenapred.gob.mx/es/Publicaciones/archivos/258-INFOGRAFAENCASODESISMO.PDF" target="_blank" rel="noreferrer">CENAPRED, infografía "Actúa en caso de sismo"</a> · <a className="underline" href="https://www.gob.mx/cenapred/articulos/que-hacer-en-caso-de-sismo-235583" target="_blank" rel="noreferrer">gob.mx/cenapred, "Qué hacer en caso de sismo"</a></p>
        <p><a className="underline" href="https://www.infobae.com/mexico/2026/02/18/simulacro-en-mexico-a-partir-de-que-piso-me-toca-hacer-repliegue-y-cuando-debo-salir/" target="_blank" rel="noreferrer">Infobae (17-feb-2026), citando el Manual de Protección Civil del STCONAPRA y a CENAPRED</a></p>
        <p><a className="underline" href="https://en.wikipedia.org/wiki/Mexican_Seismic_Alert_System" target="_blank" rel="noreferrer">SASMEX: hasta ~60 s para la CDMX; en 2017 la alerta sonó después del inicio del movimiento</a></p>
        <p><a className="underline" href="https://www.infobae.com/mexico/2026/05/06/primer-simulacro-nacional-2026-se-activa-la-alerta-sismica-en-celulares-y-altavoces/" target="_blank" rel="noreferrer">1er Simulacro Nacional 2026</a> · <a className="underline" href="https://www.unotv.com/nacional/simulacro-nacional-2026-autoridades-anuncian-fecha-hora-e-hipotesis-del-sismo/" target="_blank" rel="noreferrer">2º Simulacro Nacional 2026</a> · <a className="underline" href="https://www.jefaturadegobierno.cdmx.gob.mx/comunicacion/nota/con-exito-se-realiza-el-segundo-simulacro-nacional-2025-en-la-ciudad-de-mexico-participan-mas-de-81-millones-de-personas-clara-brugada" target="_blank" rel="noreferrer">2º Simulacro Nacional 2025 (CDMX)</a></p>
        <p><a className="underline" href="https://link.springer.com/article/10.1007/s11069-016-2735-9" target="_blank" rel="noreferrer">Lambie et al., comportamiento en video del sismo de Christchurch 2011</a></p>
      </section>
    </div>
  )
}
