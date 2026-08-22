import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Planeta_Render from '../../componentes/Planeta_Render'
import Simulador_Salto from '../../componentes/Simulador_Salto'
import Simulador_Lanzar from '../../componentes/Simulador_Lanzar'
import './Planeta_Custom.css'

const imagenes = import.meta.glob(
  '../../assets/imagenes/*',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

function obtenerImagen(nombre) {
  const entrada = Object.entries(imagenes).find(
    ([ruta]) => {
      const archivo = ruta
        .split('/')
        .pop()
        ?.split('.')[0]

      return archivo === nombre
    }
  )

  return entrada ? entrada[1] : null
}

function Planeta_Custom() {
  const { id } = useParams()

  const [planeta, setPlaneta] =
    useState(null)

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const Custom_Fondo =
    obtenerImagen('Custom_Fondo')

  useEffect(() => {
    async function cargarPlaneta() {
      setCargando(true)
      setError('')

      const token =
        localStorage.getItem('token')

      if (!token) {
        setError(
          'No hay una sesión iniciada.'
        )

        setCargando(false)
        return
      }

      try {
        const response =
          await fetch(
            `http://localhost:3001/api/custom-planets/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const data =
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.mensaje ||
            'No se pudo cargar el planeta.'
          )
        }

        setPlaneta(
          data.planeta
        )
      } catch (error) {
        setError(
          error.message ||
          'No se pudo cargar el planeta.'
        )
      } finally {
        setCargando(false)
      }
    }

    cargarPlaneta()
  }, [id])

  if (cargando) {
    return (
      <main className="pagina-planeta-custom estado-custom">
        <span>
          CARGANDO MUNDO...
        </span>
      </main>
    )
  }

  if (
    error ||
    !planeta
  ) {
    return (
      <main className="pagina-planeta-custom estado-custom">
        <span>
          MUNDO NO ENCONTRADO
        </span>

        <p>
          {error}
        </p>

        <Link to="/planetas-comunidad">
          Volver a la comunidad
        </Link>
      </main>
    )
  }

  return (
    <main className="pagina-planeta-custom">
      <section className="custom-hero">
        <div className="custom-hero-fondo">
          {Custom_Fondo && (
            <img
              src={Custom_Fondo}
              alt=""
            />
          )}

          <div className="custom-hero-overlay"></div>
        </div>

        <div className="custom-hero-contenido">
          <Link
            to="/planetas-comunidad"
            className="custom-volver"
          >
            ← PLANETAS DE LA COMUNIDAD
          </Link>

          <div className="custom-datos-layout">
            <div className="custom-texto">
              <h1>
                {planeta.nombre}
              </h1>

              <p>
                {planeta.descripcion}
              </p>
            </div>

            <aside className="custom-ficha">
              <div className="custom-ficha-imagen">
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

              <div className="custom-ficha-datos">
                <div>
                  <span>
                    Tipo
                  </span>

                  <strong>
                    {planeta.tipo}
                  </strong>
                </div>

                <div>
                  <span>
                    Color
                  </span>

                  <strong>
                    {planeta.color}
                  </strong>
                </div>

                <div>
                  <span>
                    Gravedad
                  </span>

                  <strong>
                    {planeta.gravedad} m/s²
                  </strong>
                </div>

                <div>
                  <span>
                    Diámetro
                  </span>

                  <strong>
                    {Number(
                      planeta.diametro
                    ).toLocaleString(
                      'es-AR'
                    )} km
                  </strong>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="custom-simuladores">
        <div className="custom-simuladores-cabecera">
          <span className="mini-etiqueta">
            EXPERIMENTÁ
          </span>

          <h2>
            La gravedad de este mundo
            <span>
              en acción.
            </span>
          </h2>

          <p>
            La gravedad elegida por su creador también modifica
            la experiencia dentro de los simuladores.
          </p>
        </div>

        <div className="custom-simuladores-grid">
          <Simulador_Salto
            gravedad={planeta.gravedad}
            fondoPersonalizado={
              Custom_Fondo
            }
          />

          <Simulador_Lanzar
            gravedad={planeta.gravedad}
            fondoPersonalizado={
              Custom_Fondo
            }
          />
        </div>
      </section>
    </main>
  )
}

export default Planeta_Custom