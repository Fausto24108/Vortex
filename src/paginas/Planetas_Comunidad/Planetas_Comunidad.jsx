import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Planeta_Render from '../../componentes/Planeta_Render'
import './Planetas_Comunidad.css'

function Planetas_Comunidad() {
  const [publicos, setPublicos] = useState([])
  const [mios, setMios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargarPlanetas() {
    setCargando(true)
    setError('')

    try {
      const [
        respuestaPublicos,
        respuestaMios
      ] = await Promise.all([
        fetch(
          'http://localhost:3001/api/custom-planets/public',
          {
            credentials: 'include'
          }
        ),
        fetch(
          'http://localhost:3001/api/custom-planets/mine',
          {
            credentials: 'include'
          }
        )
      ])

      if (
        !respuestaPublicos.ok ||
        !respuestaMios.ok
      ) {
        throw new Error(
          'No se pudieron cargar los planetas'
        )
      }

      const datosPublicos =
        await respuestaPublicos.json()

      const datosMios =
        await respuestaMios.json()

      setPublicos(
        datosPublicos.planetas || []
      )

      setMios(
        datosMios.planetas || []
      )
    } catch {
      setError(
        'No se pudieron cargar los planetas.'
      )
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPlanetas()
  }, [])

  return (
    <main className="pagina-comunidad">
      <section className="comunidad-hero">
        <span className="mini-etiqueta">
          VORTEX · COMUNIDAD
        </span>

        <h1>
          Mundos creados
          <span>
            por la comunidad.
          </span>
        </h1>

        <p>
          Descubrí planetas creados por otros exploradores
          y construí tu propio mundo.
        </p>
      </section>

      <section className="comunidad-layout">
        <div className="comunidad-publica">
          <div className="comunidad-seccion-cabecera">
            <div>
              <span className="mini-etiqueta">
                EXPLORÁ
              </span>

              <h2>
                Planetas de la comunidad
              </h2>
            </div>

            <span className="cantidad-planetas">
              {publicos.length}
            </span>
          </div>

          {cargando && (
            <div className="comunidad-estado">
              Cargando planetas...
            </div>
          )}

          {!cargando &&
            publicos.length === 0 && (
              <div className="comunidad-vacio">
                Todavía no hay planetas públicos.
              </div>
            )}

          {!cargando &&
            publicos.length > 0 && (
              <div className="planetas-grid">
                {publicos.map(planeta => (
                  <Link
                    key={planeta._id}
                    to={`/planetas/${planeta._id}`}
                    className="planeta-card"
                  >
                    <div className="planeta-card-visual">
                      <Planeta_Render
                        tipo={planeta.tipo}
                        color={planeta.color}
                        tamano={
                          planeta.tamano
                        }
                        diametro={
                          planeta.diametro
                        }
                      />
                    </div>

                    <div className="planeta-card-info">
                      <span>
                        {planeta.tipo}
                      </span>

                      <h3>
                        {planeta.nombre}
                      </h3>

                      <p>
                        {planeta.descripcion}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          {error && (
            <div className="comunidad-error">
              {error}
            </div>
          )}
        </div>

        <aside className="comunidad-lateral">
          <Link
            to="/crear-planeta"
            className="crear-planeta-boton"
          >
            <span className="crear-planeta-icono">
              +
            </span>

            <span>
              Agregar planeta
            </span>
          </Link>

          <div className="mis-planetas">
            <div className="mis-planetas-cabecera">
              <span className="mini-etiqueta">
                TU ESPACIO
              </span>

              <h2>
                Mis planetas
              </h2>
            </div>

            {mios.length === 0 ? (
              <div className="mis-planetas-vacio">
                Todavía no creaste ningún planeta.
              </div>
            ) : (
              <div className="mis-planetas-lista">
                {mios.map(planeta => (
                  <Link
                    key={planeta._id}
                    to={`/planetas/${planeta._id}`}
                    className="mi-planeta-item"
                  >
                    <div className="mi-planeta-mini">
                      <Planeta_Render
                        tipo={planeta.tipo}
                        color={planeta.color}
                        tamano={
                          planeta.tamano
                        }
                        diametro={
                          planeta.diametro
                        }
                      />
                    </div>

                    <div>
                      <strong>
                        {planeta.nombre}
                      </strong>

                      <span>
                        {planeta.tipo}
                      </span>
                    </div>

                    <span className="mi-planeta-flecha">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Planetas_Comunidad