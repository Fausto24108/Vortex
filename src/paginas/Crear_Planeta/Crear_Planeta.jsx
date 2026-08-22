import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Planeta_Render from '../../componentes/Planeta_Render'
import './Crear_Planeta.css'

const tipos = [
  {
    valor: 'rocoso',
    nombre: 'Rocoso'
  },
  {
    valor: 'gaseoso',
    nombre: 'Gaseoso'
  },
  {
    valor: 'gigante-helado',
    nombre: 'Gigante helado'
  }
]

const colores = [
  {
    valor: 'rojo',
    nombre: 'Rojo'
  },
  {
    valor: 'naranja',
    nombre: 'Naranja'
  },
  {
    valor: 'amarillo',
    nombre: 'Amarillo'
  },
  {
    valor: 'verde',
    nombre: 'Verde'
  },
  {
    valor: 'azul',
    nombre: 'Azul'
  },
  {
    valor: 'celeste',
    nombre: 'Celeste'
  },
  {
    valor: 'violeta',
    nombre: 'Violeta'
  },
  {
    valor: 'gris',
    nombre: 'Gris'
  }
]

const tamaños = [
  {
    valor: 'pequeño',
    nombre: 'Pequeño',
    diametro: 5000
  },
  {
    valor: 'mediano',
    nombre: 'Mediano',
    diametro: 10000
  },
  {
    valor: 'grande',
    nombre: 'Grande',
    diametro: 20000
  },
  {
    valor: 'gigante',
    nombre: 'Gigante',
    diametro: 60000
  }
]

const gravedades = [
  {
    valor: 1.6,
    nombre: 'Muy baja'
  },
  {
    valor: 3.2,
    nombre: 'Baja'
  },
  {
    valor: 6.4,
    nombre: 'Media'
  },
  {
    valor: 9.8,
    nombre: 'Alta'
  },
  {
    valor: 18.5,
    nombre: 'Muy alta'
  }
]

function Crear_Planeta() {
  const navigate = useNavigate()

  const [formulario, setFormulario] =
    useState({
      nombre: '',
      descripcion: '',
      tipo: 'rocoso',
      color: 'azul',
      tamano: 'mediano',
      gravedad: 3.2,
      diametro: 10000
    })

  const [guardando, setGuardando] =
    useState(false)

  const [error, setError] =
    useState('')

  function cambiarCampo(
    campo,
    valor
  ) {
    setFormulario(actual => ({
      ...actual,
      [campo]: valor
    }))
  }

  function cambiarTamano(valor) {
    const opcion =
      tamaños.find(
        item => item.valor === valor
      )

    if (!opcion) {
      return
    }

    setFormulario(actual => ({
      ...actual,
      tamano: opcion.valor,
      diametro: opcion.diametro
    }))
  }

  async function crearPlaneta(event) {
    event.preventDefault()

    if (
      !formulario.nombre.trim() ||
      !formulario.descripcion.trim()
    ) {
      setError(
        'Completá el nombre y la descripción.'
      )

      return
    }

    setGuardando(true)
    setError('')

    try {
      const response =
        await fetch(
          'http://localhost:3001/api/custom-planets',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type':
                'application/json'
            },
            body: JSON.stringify({
              ...formulario,
              nombre:
                formulario.nombre.trim(),
              descripcion:
                formulario.descripcion.trim()
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.mensaje ||
          'No se pudo crear el planeta.'
        )
      }

      navigate(
        `/planetas/${data.planeta._id}`
      )
    } catch (error) {
      setError(
        error.message ||
        'No se pudo crear el planeta.'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <main className="pagina-crear-planeta">
      <section className="crear-planeta-hero">
        <Link
          to="/planetas-comunidad"
          className="crear-planeta-volver"
        >
          ← VOLVER A LA COMUNIDAD
        </Link>

        <span className="mini-etiqueta">
          CREACIÓN PLANETARIA
        </span>

        <h1>
          Diseñá tu
          <span>
            propio mundo.
          </span>
        </h1>

        <p>
          Elegí las características principales de tu planeta
          y Vortex se encargará de transformarlas en un mundo.
        </p>
      </section>

      <section className="crear-planeta-layout">
        <form
          className="crear-planeta-formulario"
          onSubmit={crearPlaneta}
        >
          <div className="campo">
            <label htmlFor="nombre">
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              value={formulario.nombre}
              maxLength={40}
              placeholder="Nombre"
              onChange={event =>
                cambiarCampo(
                  'nombre',
                  event.target.value
                )
              }
            />
          </div>

          <div className="campo">
            <label htmlFor="descripcion">
              Descripción
            </label>

            <textarea
              id="descripcion"
              rows="6"
              maxLength={500}
              placeholder="Descripción"
              value={formulario.descripcion}
              onChange={event =>
                cambiarCampo(
                  'descripcion',
                  event.target.value
                )
              }
            />
          </div>

          <div className="campo">
            <label>
              Tipo de planeta
            </label>

            <div className="opciones-grid">
              {tipos.map(opcion => (
                <button
                  key={opcion.valor}
                  type="button"
                  className={
                    formulario.tipo ===
                    opcion.valor
                      ? 'opcion activa'
                      : 'opcion'
                  }
                  onClick={() =>
                    cambiarCampo(
                      'tipo',
                      opcion.valor
                    )
                  }
                >
                  {opcion.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="campo">
            <label>
              Color
            </label>

            <div className="opciones-grid colores-grid">
              {colores.map(opcion => (
                <button
                  key={opcion.valor}
                  type="button"
                  className={
                    formulario.color ===
                    opcion.valor
                      ? 'opcion activa'
                      : 'opcion'
                  }
                  onClick={() =>
                    cambiarCampo(
                      'color',
                      opcion.valor
                    )
                  }
                >
                  <span
                    className={`color-muestra color-${opcion.valor}`}
                  ></span>

                  {opcion.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="campo">
            <label>
              Gravedad
            </label>

            <div className="opciones-grid">
              {gravedades.map(opcion => (
                <button
                  key={opcion.valor}
                  type="button"
                  className={
                    formulario.gravedad ===
                    opcion.valor
                      ? 'opcion activa'
                      : 'opcion'
                  }
                  onClick={() =>
                    cambiarCampo(
                      'gravedad',
                      opcion.valor
                    )
                  }
                >
                  <span>
                    {opcion.nombre}
                  </span>

                  <small>
                    {opcion.valor} m/s²
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div className="campo">
            <label>
              Tamaño
            </label>

            <div className="opciones-grid">
              {tamaños.map(opcion => (
                <button
                  key={opcion.valor}
                  type="button"
                  className={
                    formulario.tamano ===
                    opcion.valor
                      ? 'opcion activa'
                      : 'opcion'
                  }
                  onClick={() =>
                    cambiarTamano(
                      opcion.valor
                    )
                  }
                >
                  <span>
                    {opcion.nombre}
                  </span>

                  <small>
                    {opcion.diametro.toLocaleString(
                      'es-AR'
                    )} km
                  </small>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="crear-planeta-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="crear-planeta-submit"
            disabled={guardando}
          >
            {guardando
              ? 'CREANDO PLANETA...'
              : 'CREAR PLANETA'
            }
          </button>
        </form>

        <aside className="crear-planeta-preview">
          <div className="preview-cabecera">
            <span className="mini-etiqueta">
              VISTA PREVIA
            </span>

            <span>
              TU MUNDO
            </span>
          </div>

          <div className="preview-escenario">
            <div className="preview-estrellas"></div>

            <div className="preview-planeta">
              <Planeta_Render
                tipo={formulario.tipo}
                color={formulario.color}
                tamano={formulario.tamano}
              />
            </div>

            <div className="preview-info">
              <span>
                {formulario.tipo}
              </span>

              <h2>
                {formulario.nombre ||
                  'Tu planeta'}
              </h2>
            </div>
          </div>

          <div className="preview-datos">
            <div>
              <span>
                Gravedad
              </span>

              <strong>
                {formulario.gravedad} m/s²
              </strong>
            </div>

            <div>
              <span>
                Diámetro
              </span>

              <strong>
                {formulario.diametro.toLocaleString(
                  'es-AR'
                )} km
              </strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Crear_Planeta