import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Sin Aviso — ensaya el sismo que no avisa',
  description: 'Tres ensayos de sismo en tu teléfono: sin aviso, con aviso y repetir el más débil. Mide cuánto tardas en decidir. Crystal Ball Studio, semana 6.',
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0c0a09' }

const NAV = [['/configurar', 'Configurar'], ['/ensayo', 'Ensayar'], ['/resultados', 'Mis resultados'], ['/grupo', 'Grupo'], ['/reglas', 'Reglas']]

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased">
        <header className="border-b border-stone-800">
          <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm">
            <Link href="/" className="mr-auto font-bold tracking-tight text-amber-400">Sin Aviso</Link>
            {NAV.map(([h, t]) => <Link key={h} href={h} className="text-stone-300 hover:text-white">{t}</Link>)}
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 pb-10 pt-6 text-xs leading-relaxed text-stone-500">
          Ejercicio escolar de Andrés Álvarez Morphy (Crystal Ball Studio, semana 6). No es de Protección Civil ni la reemplaza · dibujo en pantalla, no realidad virtual · nada sale de tu teléfono.
        </footer>
      </body>
    </html>
  )
}
