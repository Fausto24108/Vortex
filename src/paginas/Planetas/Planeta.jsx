import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Simulador_Salto from '../../componentes/Simulador_Salto'
import Simulador_Lanzar from '../../componentes/Simulador_Lanzar'

import './Planeta.css'

const imagenes = import.meta.glob(
  '../../assets/imagenes/*',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

function obtenerAssetPorNombre(nombre) {
  const entrada = Object.entries(imagenes).find(
    ([ruta]) => {
      const archivo =
        ruta
          .split('/')
          .pop()
          ?.split('.')[0]

      return archivo === nombre
    }
  )

  return entrada ? entrada[1] : null
}

function capitalizarSlug(slug) {
  if (!slug) {
    return ''
  }

  return (
    slug.charAt(0).toUpperCase() +
    slug.slice(1)
  )
}

function Planeta() {
  const { slug } = useParams()

  const [planeta, setPlaneta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    async function cargarPlaneta() {
      setCargando(true)
      setError('')

      try {
        const response = await fetch(
          `http://localhost:3001/api/planetas/${slug}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.mensaje ||
            'No se pudo cargar el planeta'
          )
        }

        if (activo) {
          setPlaneta(data.planeta)
        }
      } catch (error) {
        if (activo) {
          setError(error.message)
          setPlaneta(null)
        }
      } finally {
        if (activo) {
          setCargando(false)
        }
      }
    }

    cargarPlaneta()

    return () => {
      activo = false
    }
  }, [slug])

  const nombreImagenPlaneta = useMemo(() => {
    if (!slug) {
      return null
    }

    return capitalizarSlug(slug)
  }, [slug])

  const imagenPlaneta = useMemo(() => {
    if (!nombreImagenPlaneta) {
      return null
    }

    return obtenerAssetPorNombre(
      nombreImagenPlaneta
    )
  }, [nombreImagenPlaneta])

  const fondoPlaneta = useMemo(() => {
    if (!slug) {
      return null
    }

    return obtenerAssetPorNombre(
      `Fondo_${capitalizarSlug(slug)}`
    )
  }, [slug])

  if (cargando) {
    return (
      <main className="pagina-planeta estado-planeta">
        <div className="planeta-cargando">
          <span>EXPLORANDO</span>

          <h1>
            Cargando planeta...
          </h1>
        </div>
      </main>
    )
  }

  if (error || !planeta) {
    return (
      <main className="pagina-planeta estado-planeta">
        <div className="planeta-error">
          <span>ERROR 404</span>

          <h1>
            Este mundo no existe.
          </h1>

          <p>
            No pudimos encontrar un planeta con ese identificador.
          </p>

          <Link
            to="/sistema-solar"
            className="planeta-volver"
          >
            Volver al Sistema Solar
          </Link>
        </div>
      </main>
    )
  }

  const esSol =
    planeta.slug === 'sol' ||
    planeta.tipo === 'Estrella'

  return (
    <main className="pagina-planeta">
      <section className="planeta-cabecera">
        <div className="planeta-cabecera-contenido">
          <Link
            to="/sistema-solar"
            className="planeta-migaja"
          >
            ← SISTEMA SOLAR
          </Link>

          <span className="planeta-etiqueta">
            {planeta.tipo}
          </span>

          <h1>
            {planeta.nombre}
          </h1>

          <p>
            {esSol
              ? 'La estrella central de nuestro Sistema Solar.'
              : `Explorá ${planeta.nombre} y descubrí sus características, historia y condiciones físicas.`
            }
          </p>
        </div>
      </section>

      <section className="planeta-articulo">
        <article className="planeta-contenido">
          <span className="mini-etiqueta">
            SOBRE {planeta.nombre.toUpperCase()}
          </span>

          <h2>
            Un mundo con una historia
            <span> propia.</span>
          </h2>

          <div className="planeta-descripcion">
            {planeta.descripcion
              .split(/\n{2,}/)
              .map(
                (
                  parrafo,
                  indice
                ) => (
                  <p key={indice}>
                    {parrafo.trim()}
                  </p>
                )
              )
            }
          </div>
        </article>

        <aside className="planeta-ficha">
          <div className="planeta-ficha-imagen">
            {imagenPlaneta ? (
              <img
                src={imagenPlaneta}
                alt={planeta.nombre}
              />
            ) : (
              <div className="planeta-imagen-fallback">
                {planeta.nombre}
              </div>
            )}

            <div className="planeta-ficha-overlay">
              <span>
                {planeta.tipo}
              </span>
            </div>
          </div>

          <div className="planeta-ficha-contenido">
            <h2>
              {planeta.nombre}
            </h2>

            <div className="planeta-ficha-lista">
              <div>
                <span>Tipo</span>

                <strong>
                  {planeta.tipo}
                </strong>
              </div>

              <div>
                <span>Gravedad</span>

                <strong>
                  {planeta.gravedad} m/s²
                </strong>
              </div>

              <div>
                <span>Diámetro</span>

                <strong>
                  {Number(
                    planeta.diametro
                  ).toLocaleString(
                    'es-AR'
                  )}{' '}
                  km
                </strong>
              </div>

              <div>
                <span>Masa</span>

                <strong>
                  {planeta.masa}
                </strong>
              </div>

              <div>
                <span>Distancia al Sol</span>

                <strong>
                  {planeta.distanciaSol}
                </strong>
              </div>

              <div>
                <span>
                  Temperatura de día
                </span>

                <strong>
                  {planeta.temperaturaDia}
                </strong>
              </div>

              <div>
                <span>
                  Temperatura de noche
                </span>

                <strong>
                  {planeta.temperaturaNoche}
                </strong>
              </div>

              <div>
                <span>
                  Duración del día
                </span>

                <strong>
                  {planeta.duracionDia}
                </strong>
              </div>

              <div>
                <span>
                  Duración del año
                </span>

                <strong>
                  {planeta.duracionOrbita}
                </strong>
              </div>

              <div>
                <span>Lunas</span>

                <strong>
                  {planeta.cantidadLunas}
                </strong>
              </div>

              <div>
                <span>
                  Descubrimiento
                </span>

                <strong>
                  {planeta.descubrimiento}
                </strong>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="planeta-contexto">
        <div className="planeta-contexto-linea"></div>

        <span className="mini-etiqueta">
          {esSol
            ? 'ESTRELLA CENTRAL'
            : 'EXPLORACIÓN PLANETARIA'
          }
        </span>

        <h2>
          {esSol
            ? 'El corazón gravitacional del Sistema Solar.'
            : 'Ahora llevemos estos datos a la práctica.'
          }
        </h2>

        <p>
          {esSol
            ? 'El Sol no se comporta como una superficie planetaria y por eso no utilizamos los simuladores de salto y lanzamiento en este mundo.'
            : 'La gravedad que ves en la ficha técnica no es solamente un número. Cambia la forma en que un objeto se mueve, cuánto podés saltar y cómo responde un lanzamiento.'
          }
        </p>
      </section>

      {!esSol && (
        <section className="planeta-simuladores">
          <div className="planeta-simuladores-titulo">
            <span className="mini-etiqueta">
              EXPERIMENTÁ
            </span>

            <h2>
              La gravedad
              <span> en acción.</span>
            </h2>

            <p>
              Probá cómo cambia el movimiento dependiendo del mundo en
              el que te encuentres.
            </p>
          </div>

          <div className="simuladores-grid">
            <Simulador_Salto
              gravedad={planeta.gravedad}
              slug={planeta.slug}
            />

            <Simulador_Lanzar
              gravedad={planeta.gravedad}
              slug={planeta.slug}
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default Planeta