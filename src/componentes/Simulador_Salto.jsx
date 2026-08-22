import { useEffect, useRef, useState } from 'react'
import './Simulador_Salto.css'

const imagenes = import.meta.glob(
  '../assets/imagenes/*',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

function obtenerAsset(nombre) {
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

function capitalizar(slug) {
  return slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : ''
}

function Simulador_Salto({
  gravedad,
  slug,
  fondoPersonalizado
}) {
  const astronautaRef = useRef(null)
  const frameRef = useRef(null)

  const yRef = useRef(0)
  const velocidadYRef = useRef(0)
  const ultimoTiempoRef = useRef(0)

  const gravedadRef =
    useRef(Number(gravedad) || 0)

  const saltandoRef =
    useRef(false)

  const [altura, setAltura] =
    useState(0)

  const fondo =
    fondoPersonalizado ||
    obtenerAsset(
      `${capitalizar(slug)}_Fondo`
    )

  const astronauta =
    obtenerAsset(
      'AstronautaIdle'
    )

  const VELOCIDAD_INICIAL = 7.5
  const PIXELES_POR_METRO = 42
  const SUELO = 42

  useEffect(() => {
    gravedadRef.current =
      Number(gravedad) || 0
  }, [gravedad])

  useEffect(() => {
    function saltar(event) {
      if (
        event.code !== 'Space'
      ) {
        return
      }

      event.preventDefault()

      if (
        saltandoRef.current
      ) {
        return
      }

      saltandoRef.current =
        true

      velocidadYRef.current =
        VELOCIDAD_INICIAL

      ultimoTiempoRef.current =
        performance.now()
    }

    window.addEventListener(
      'keydown',
      saltar
    )

    return () => {
      window.removeEventListener(
        'keydown',
        saltar
      )
    }
  }, [])

  useEffect(() => {
    function actualizar(tiempo) {
      const ultimo =
        ultimoTiempoRef.current ||
        tiempo

      const dt =
        Math.min(
          (tiempo - ultimo) / 1000,
          0.033
        )

      ultimoTiempoRef.current =
        tiempo

      if (
        saltandoRef.current
      ) {
        velocidadYRef.current -=
          gravedadRef.current * dt

        yRef.current +=
          velocidadYRef.current * dt

        if (
          yRef.current <= 0
        ) {
          yRef.current = 0
          velocidadYRef.current = 0
          saltandoRef.current = false
        }

        if (
          astronautaRef.current
        ) {
          astronautaRef.current.style.bottom =
            `${
              SUELO +
              yRef.current *
              PIXELES_POR_METRO
            }px`
        }

        setAltura(
          yRef.current
        )
      }

      frameRef.current =
        requestAnimationFrame(
          actualizar
        )
    }

    frameRef.current =
      requestAnimationFrame(
        actualizar
      )

    return () => {
      cancelAnimationFrame(
        frameRef.current
      )
    }
  }, [])

  function reiniciar() {
    yRef.current = 0
    velocidadYRef.current = 0
    saltandoRef.current = false
    ultimoTiempoRef.current = 0

    if (
      astronautaRef.current
    ) {
      astronautaRef.current.style.bottom =
        `${SUELO}px`
    }

    setAltura(0)
  }

  const alturaMaxima =
    (
      VELOCIDAD_INICIAL *
      VELOCIDAD_INICIAL
    ) /
    (
      2 *
      Math.max(
        gravedadRef.current,
        0.01
      )
    )

  return (
    <article className="simulador simulador-salto">
      <div className="simulador-cabecera">
        <div>
          <span className="simulador-etiqueta">
            SIMULADOR 01
          </span>

          <h3>
            Salto
          </h3>
        </div>

        <div className="simulador-gravedad">
          {gravedad} m/s²
        </div>
      </div>

      <div
        className="simulador-escenario"
        style={{
          backgroundImage:
            fondo
              ? `url("${fondo}")`
              : 'none'
        }}
        onClick={() => {
          if (
            !saltandoRef.current
          ) {
            saltandoRef.current = true

            velocidadYRef.current =
              VELOCIDAD_INICIAL

            ultimoTiempoRef.current =
              performance.now()
          }
        }}
      >
        <div className="simulador-overlay"></div>

        <div className="simulador-instruccion">
          ESPACIO · CLICK
        </div>

        <div
          ref={astronautaRef}
          className="astronauta"
        >
          {astronauta && (
            <img
              src={astronauta}
              alt=""
            />
          )}
        </div>

        <div className="simulador-piso"></div>
      </div>

      <div className="simulador-controles">
        <div>
          <span>
            Altura actual
          </span>

          <strong>
            {altura.toFixed(2)} m
          </strong>
        </div>

        <div>
          <span>
            Altura máxima
          </span>

          <strong>
            {alturaMaxima.toFixed(2)} m
          </strong>
        </div>

        <button
          type="button"
          onClick={reiniciar}
        >
          Reiniciar
        </button>
      </div>
    </article>
  )
}

export default Simulador_Salto