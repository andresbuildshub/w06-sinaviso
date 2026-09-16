'use client'
// El cuarto 3D (three.js). Simulación en pantalla, no es VR. El temblor es inventado (no viene de un registro real).
// La decisión es tocar un lugar del cuarto: mesa, marco, salida, ventana o la señora del sofá.
import { useEffect, useRef, useState } from 'react'
import { ACCIONES, nombreAccion } from '../lib/ensayo.js'

const AMPLITUD = { suave: 0.025, media: 0.05, fuerte: 0.09 }

export default function Cuarto({ fase, intensidad = 'media', noche = false, nivel = 'p1', elegida = null, onElegir }) {
  const caja = useRef(null)
  const vivo = useRef({ fase, intensidad, elegida, onElegir })
  const [sinWebGL, setSinWebGL] = useState(false)
  vivo.current = { fase, intensidad, elegida, onElegir }

  useEffect(() => {
    let cancelado = false, raf = 0, limpiar = () => {}
    import('three').then(THREE => {
      if (cancelado || !caja.current) return
      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true })
      } catch { setSinWebGL(true); return }
      const el = caja.current
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      el.appendChild(renderer.domElement)
      renderer.domElement.style.display = 'block'
      renderer.domElement.style.touchAction = 'manipulation'

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(noche ? 0x0b0f1a : 0x3f3a36)
      const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 50)
      const base = new THREE.Vector3(0, 1.55, 3.4)
      camera.position.copy(base)
      camera.lookAt(0, 1.0, -1.2)

      const cuarto = new THREE.Group(); scene.add(cuarto)
      const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra })
      const caja3 = (w, h, d, color, x, y, z, accion, parent = cuarto) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color))
        m.position.set(x, y, z); if (accion) m.userData.accion = accion
        parent.add(m); return m
      }
      const tocables = {}
      const marcar = (accion, ...meshes) => { tocables[accion] = [...(tocables[accion] || []), ...meshes]; meshes.forEach(m => { m.userData.accion = accion }) }

      // cuarto
      caja3(6, 0.05, 6, noche ? 0x2a2522 : 0x6b5e52, 0, -0.025, -0.5)
      caja3(6, 3, 0.05, noche ? 0x3a3d4a : 0xcfc6b8, 0, 1.5, -3)
      caja3(0.05, 3, 6, noche ? 0x343744 : 0xbdb3a4, -3, 1.5, -0.5)
      caja3(0.05, 3, 6, noche ? 0x343744 : 0xbdb3a4, 3, 1.5, -0.5)

      // ventana (pared del fondo, derecha)
      const vidrio = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.1), new THREE.MeshStandardMaterial({ color: noche ? 0x1b2a4a : 0x9fd8ff, emissive: noche ? 0x0a1224 : 0x5aa9d6, emissiveIntensity: 0.6 }))
      vidrio.position.set(1.3, 1.7, -2.96); cuarto.add(vidrio)
      const mv = [caja3(1.65, 0.08, 0.08, 0xeeeeee, 1.3, 2.28, -2.94), caja3(1.65, 0.08, 0.08, 0xeeeeee, 1.3, 1.12, -2.94),
        caja3(0.08, 1.2, 0.08, 0xeeeeee, 0.5, 1.7, -2.94), caja3(0.08, 1.2, 0.08, 0xeeeeee, 2.1, 1.7, -2.94), caja3(0.05, 1.1, 0.06, 0xeeeeee, 1.3, 1.7, -2.93)]
      marcar('ventana', vidrio, ...mv)

      // marco de la puerta (pared del fondo, izquierda)
      const hueco = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 2.05), mat(0x1a1512))
      hueco.position.set(-1.9, 1.03, -2.96); cuarto.add(hueco)
      marcar('marco', hueco,
        caja3(0.12, 2.15, 0.12, 0x8a5a2b, -2.43, 1.07, -2.92), caja3(0.12, 2.15, 0.12, 0x8a5a2b, -1.37, 1.07, -2.92), caja3(1.18, 0.12, 0.12, 0x8a5a2b, -1.9, 2.15, -2.92))

      // mesa (centro)
      const mesa = new THREE.Group(); mesa.position.set(-0.2, 0, -1.1); cuarto.add(mesa)
      marcar('mesa', caja3(1.5, 0.08, 0.9, 0x8b4a1c, 0, 0.76, 0, null, mesa),
        ...[[-0.68, -0.38], [0.68, -0.38], [-0.68, 0.38], [0.68, 0.38]].map(([x, z]) => caja3(0.07, 0.74, 0.07, 0x6b3714, x, 0.37, z, null, mesa)))

      // salida: puerta a la calle (planta baja) o escalera hacia abajo (pisos)
      if (nivel === 'pb') {
        const puerta = caja3(0.06, 2.1, 1.0, 0x2f6b4a, 2.96, 1.05, 0.2)
        const manija = caja3(0.08, 0.08, 0.08, 0xd4af37, 2.9, 1.05, -0.15)
        const letrero = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.18), mat(0x16a34a, { emissive: 0x16a34a, emissiveIntensity: noche ? 0.9 : 0.3 }))
        letrero.position.set(2.93, 2.3, 0.2); letrero.rotation.y = -Math.PI / 2; cuarto.add(letrero)
        marcar('salida', puerta, manija, letrero)
      } else {
        const esc = []
        for (let i = 0; i < 5; i++) esc.push(caja3(1.0, 0.12, 0.35, 0x9c8f80, 2.35, -0.06 - i * 0.02 + 0.3 - i * 0.07, 0.9 - i * 0.35))
        esc.push(caja3(0.05, 0.9, 1.9, 0x444444, 1.83, 0.75, 0.2), caja3(0.05, 0.05, 1.9, 0x777777, 1.83, 1.2, 0.2))
        const hueco2 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.8), mat(0x151210)); hueco2.rotation.x = -Math.PI / 2; hueco2.position.set(2.35, 0.005, 0.2); cuarto.add(hueco2)
        marcar('salida', hueco2, ...esc)
      }

      // sofá con la señora (izquierda)
      const sofa = new THREE.Group(); sofa.position.set(-2.35, 0, -0.4); sofa.rotation.y = Math.PI / 2; cuarto.add(sofa)
      const piezasSofa = [caja3(1.9, 0.45, 0.8, 0x8c1c3a, 0, 0.23, 0, null, sofa), caja3(1.9, 0.6, 0.2, 0x7a1832, 0, 0.72, -0.35, null, sofa),
        caja3(0.2, 0.55, 0.8, 0x7a1832, -0.95, 0.4, 0, null, sofa), caja3(0.2, 0.55, 0.8, 0x7a1832, 0.95, 0.4, 0, null, sofa)]
      const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.6, 16), mat(0xd9669b)); cuerpo.position.set(0.3, 0.75, -0.05); sofa.add(cuerpo)
      const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), mat(0xc58c5c)); cabeza.position.set(0.3, 1.2, -0.05); sofa.add(cabeza)
      const pelo = new THREE.Mesh(new THREE.SphereGeometry(0.165, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xdddddd)); pelo.position.set(0.3, 1.23, -0.07); sofa.add(pelo)
      const andadera = caja3(0.5, 0.8, 0.05, 0x9ca3af, 0.3, 0.4, 0.75, null, sofa)
      marcar('persona', ...piezasSofa, cuerpo, cabeza, pelo, andadera)

      // repisa con objetos que caen + lámpara colgante
      caja3(1.2, 0.05, 0.3, 0x5b4636, -0.2, 1.9, -2.83)
      const objetos = [[-0.55, 0x2563eb, 0.18], [-0.2, 0xf59e0b, 0.26], [0.15, 0x10b981, 0.2]].map(([x, c, h]) => {
        const o = caja3(0.14, h, 0.14, c, x, 1.925 + h / 2, -2.8); o.userData.vel = new THREE.Vector3(); o.userData.cae = false; return o
      })
      const pivote = new THREE.Group(); pivote.position.set(0, 3.0, -1.1); cuarto.add(pivote)
      const cable = caja3(0.015, 0.7, 0.015, 0x222222, 0, -0.35, 0, null, pivote)
      const foco = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshStandardMaterial({ color: 0xfff1b8, emissive: 0xffe08a, emissiveIntensity: noche ? 0.2 : 0.8 }))
      foco.position.y = -0.75; pivote.add(foco); void cable

      // luz
      scene.add(new THREE.AmbientLight(0xffffff, noche ? 0.18 : 0.75))
      const sol = new THREE.DirectionalLight(noche ? 0x8fa8ff : 0xfff4e0, noche ? 0.35 : 1.1); sol.position.set(2, 4, 3); scene.add(sol)
      const luzFoco = new THREE.PointLight(0xffe0a0, noche ? 0.4 : 1.2, 7); luzFoco.position.set(0, 2.2, -1.1); scene.add(luzFoco)

      // tocar
      const ray = new THREE.Raycaster(), p = new THREE.Vector2()
      const todos = Object.values(tocables).flat()
      const brillar = accion => (tocables[accion] || []).forEach(m => { if (m.material?.emissive) { m.material = m.material.clone(); m.material.emissive.setHex(0xf59e0b); m.material.emissiveIntensity = 0.55 } })
      let yaBrillo = null
      const tocar = ev => {
        const { fase: f, elegida: e, onElegir: cb } = vivo.current
        if (e || !(f === 'aviso' || f === 'temblor')) return
        const r = renderer.domElement.getBoundingClientRect()
        p.x = ((ev.clientX - r.left) / r.width) * 2 - 1; p.y = -((ev.clientY - r.top) / r.height) * 2 + 1
        ray.setFromCamera(p, camera)
        const hit = ray.intersectObjects(todos, false).find(h => h.object.userData.accion)
        if (hit && ACCIONES.includes(hit.object.userData.accion)) cb?.(hit.object.userData.accion)
      }
      renderer.domElement.addEventListener('pointerdown', tocar)

      const ajustar = () => {
        const w = el.clientWidth, h = el.clientHeight
        renderer.setSize(w, h, false); renderer.domElement.style.width = w + 'px'; renderer.domElement.style.height = h + 'px'
        camera.aspect = w / h; camera.fov = w / h < 0.8 ? 74 : 62; camera.updateProjectionMatrix()
      }
      ajustar()
      const ro = new ResizeObserver(ajustar); ro.observe(el)

      const reloj = new THREE.Clock()
      let inicioTemblor = null
      const cuadro = () => {
        raf = requestAnimationFrame(cuadro)
        const t = reloj.getElapsedTime(), dt = Math.min(reloj.getDelta(), 0.05) || 0.016
        const { fase: f, intensidad: i, elegida: e } = vivo.current
        if (e && yaBrillo !== e) { brillar(e); yaBrillo = e }
        const A = f === 'temblor' ? (AMPLITUD[i] || 0.05) : 0
        if (f === 'temblor' && inicioTemblor === null) inicioTemblor = t
        const rampa = inicioTemblor === null ? 0 : Math.min(1, (t - inicioTemblor) / 1.5)
        const a = A * rampa
        camera.position.set(base.x + a * (Math.sin(t * 23) + 0.6 * Math.sin(t * 41)), base.y + a * 0.7 * Math.sin(t * 29), base.z + a * 0.5 * Math.sin(t * 17))
        camera.lookAt(a * Math.sin(t * 19), 1.0 + a * 0.5 * Math.sin(t * 31), -1.2)
        cuarto.rotation.z = a * 0.12 * Math.sin(t * 13)
        pivote.rotation.z = a * 5 * Math.sin(t * 2.7); pivote.rotation.x = a * 3 * Math.sin(t * 2.1)
        if (inicioTemblor !== null && f === 'temblor') {
          objetos.forEach((o, k) => {
            if (!o.userData.cae && t - inicioTemblor > 1.2 + k * 1.1 * (1.2 - rampa)) { o.userData.cae = true; o.userData.vel.set((k - 1) * 0.3, 0.4, 0.9) }
          })
        }
        objetos.forEach(o => {
          if (!o.userData.cae) return
          const v = o.userData.vel
          if (o.position.y > o.geometry.parameters.height / 2) { v.y -= 9.8 * dt; o.position.addScaledVector(v, dt); o.rotation.x += dt * 4; o.rotation.z += dt * 3 }
          else { o.position.y = o.geometry.parameters.height / 2; v.set(0, 0, 0) }
        })
        renderer.render(scene, camera)
      }
      cuadro()

      limpiar = () => {
        cancelAnimationFrame(raf); ro.disconnect()
        renderer.domElement.removeEventListener('pointerdown', tocar)
        scene.traverse(o => { o.geometry?.dispose?.(); if (o.material) [].concat(o.material).forEach(m => m.dispose?.()) })
        renderer.dispose(); renderer.domElement.remove()
      }
    }).catch(() => setSinWebGL(true))
    return () => { cancelado = true; cancelAnimationFrame(raf); limpiar() }
  }, [noche, nivel])

  const activo = fase === 'aviso' || fase === 'temblor'
  return (
    <div className={`relative overflow-hidden rounded-xl border border-stone-700 ${fase === 'temblor' ? 'sacudida' : ''}`}>
      <div ref={caja} className="h-[58vh] min-h-[340px] w-full bg-stone-900" data-fase={fase} />
      {sinWebGL && (
        <div className="absolute inset-0 grid grid-cols-2 gap-2 bg-stone-900 p-3">
          <p className="col-span-2 text-xs text-stone-400">Tu teléfono no pudo dibujar el cuarto 3D. Toca a dónde vas:</p>
          {ACCIONES.map(a => (
            <button key={a} disabled={!activo || !!elegida} onClick={() => onElegir?.(a)} className={`rounded-lg border px-2 py-4 text-sm ${elegida === a ? 'border-amber-400 bg-amber-400/20' : 'border-stone-600'}`}>
              {nombreAccion(a, nivel)}
            </button>
          ))}
        </div>
      )}
      <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-stone-950/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
        Simulación en pantalla · no es VR · temblor inventado
      </span>
    </div>
  )
}
