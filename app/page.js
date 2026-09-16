import Link from 'next/link'

export default function Inicio() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Ensayo de sismo en tu teléfono</p>
        <h1 className="text-3xl font-bold leading-tight">Ensaya el sismo que no avisa.</h1>
        <p className="text-stone-300">
          El simulacro nacional siempre ensaya lo mismo: suena la alerta y sales. El 19 de septiembre de 2017, en la Ciudad de México, la alerta sonó
          <b> después</b> de que empezó a temblar. Aquí ensayas los dos casos, en tu casa, cuando tú lo permitas.
        </p>
      </section>

      <ol className="space-y-3">
        {[
          ['1', 'Dinos dónde ensayas', 'Tu ciudad, en qué piso estás y a qué horas te puede tocar. Con tu ciudad calculamos cuántos segundos de aviso tendrías.', '/configurar', 'Configurar'],
          ['2', 'Solo 3 ensayos cortos', 'Uno sin aviso y uno con aviso, en orden al azar. El tercero repite el que te costó más, a otra hora.', '/ensayo', 'Ensayar'],
          ['3', 'Ve tus resultados', 'Cuánto tardaste en decidir y si tu decisión va contra la guía oficial de Protección Civil. Solo tú los ves.', '/resultados', 'Mis resultados'],
        ].map(([n, t, d, h, b]) => (
          <li key={n} className="rounded-xl border border-stone-800 p-4">
            <p className="font-semibold"><span className="mr-2 text-amber-400">{n}</span>{t}</p>
            <p className="mt-1 text-sm text-stone-400">{d}</p>
            <Link href={h} className="mt-3 inline-block rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-stone-900">{b}</Link>
          </li>
        ))}
      </ol>

      <section className="rounded-xl border border-stone-700 bg-stone-900 p-4 text-sm text-stone-300">
        <p className="font-semibold text-stone-100">Lo que mide y lo que no</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><b>Sí mide:</b> cuántos segundos tardas en decidir a dónde ir cuando te toma por sorpresa, y si esa decisión va contra la guía oficial.</li>
          <li><b>No mide</b> lo que hace tu cuerpo en un sismo real. Nadie ha probado que un ensayo en pantalla prediga eso, y esta app no lo promete.</li>
          <li><b>No usa</b> cámara, micrófono ni ubicación. Tus resultados se quedan en este teléfono.</li>
          <li>El temblor es un <b>dibujo que se mueve en la pantalla</b> (no es realidad virtual) y su duración es inventada. Puedes terminar cuando quieras.</li>
        </ul>
      </section>
    </div>
  )
}
