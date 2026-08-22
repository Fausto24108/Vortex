import { useRef, useState } from 'react'
import './Simulador_Lanzar.css'

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
  if (!slug) {
    return ''
  }

  return slug.charAt(0).toUpperCase() + slug.slice(1)
}

function Simulador_Lanzar({
  gravedad,
  slug,
  fondoPersonalizado
}) {
  const escenarioRef = useRef(null)
  const objetoRef = useRef(null)
  const animacionRef = useRef(null)

  const [arrastrando, setArrastrando] =
    useState(false)

  const [linea, setLinea] =
    useState({
      visible: false,
      x: 0,
      y: 0,
      longitud: 0,
      angulo: 0
    })

  const [resultado, setResultado] =
    useState(null)

  const [cargando, setCargando] =
    useState(false)

  const [error, setError] =
    useState('')

  const fondo =
    fondoPersonalizado ||
    obtenerAsset(
      `${capitalizar(slug)}_Fondo`
    )

  const astronauta =
    obtenerAsset(
      'AstronautaIdle'
    )

  const origen = {
    x: 155,
    y: 245
  }

  function obtenerPosicion(event) {
    const rect =
      escenarioRef.current
        .getBoundingClientRect()

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top
    }
  }

  function iniciarArrastre(event) {
    if (cargando) {
      return
    }

    event.preventDefault()

    setArrastrando(true)
    setResultado(null)
    setError('')

    escenarioRef.current.setPointerCapture(
      event.pointerId
    )
  }

  function actualizarLinea(event) {
    if (!arrastrando) {
      return
    }

    const posicion =
      obtenerPosicion(event)

    const dx =
      posicion.x -
      origen.x

    const dy =
      posicion.y -
      origen.y

    const longitud =
      Math.min(
        170,
        Math.hypot(
          dx,
          dy
        )
      )

    const angulo =
      Math.atan2(
        dy,
        dx
      ) *
      (180 / Math.PI)

    setLinea({
      visible: true,
      x: origen.x,
      y: origen.y,
      longitud,
      angulo
    })
  }

  async function terminarArrastre(event) {
    if (!arrastrando) {
      return
    }

    const posicion =
      obtenerPosicion(event)

    const dx =
      posicion.x -
      origen.x

    const dy =
      posicion.y -
      origen.y

    const distancia =
      Math.hypot(
        dx,
        dy
      )

    setArrastrando(false)

    setLinea({
      visible: false,
      x: 0,
      y: 0,
      longitud: 0,
      angulo: 0
    })

    if (
      distancia < 15
    ) {
      return
    }

    const velocidadInicial =
      Math.min(
        22,
        Math.max(
          3,
          distancia * 0.075
        )
      )

    const anguloFisico =
      Math.atan2(
        -dy,
        dx
      ) *
      (180 / Math.PI)

    await lanzar(
      velocidadInicial,
      anguloFisico
    )
  }

  async function lanzar(
    velocidadInicial,
    angulo
  ) {
    setCargando(true)
    setError('')

    if (objetoRef.current) {
      objetoRef.current.style.transform =
        'translate(0px, 0px)'
    }

    try {
      const response =
        await fetch(
          'http://127.0.0.1:8000/simulador/lanzamiento',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json'
            },
            body: JSON.stringify({
              gravedad,
              velocidadInicial,
              angulo
            })
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail ||
          'No se pudo calcular el lanzamiento'
        )
      }

      setResultado(data)

      animarTrayectoria(
        data.trayectoria
      )
    } catch (error) {
      console.error(error)

      setError(
        'No se pudo calcular la trayectoria.'
      )
    } finally {
      setCargando(false)
    }
  }

  function interpolar(
    a,
    b,
    factor
  ) {
    return (
      a +
      (
        b - a
      ) *
      factor
    )
  }

  function obtenerPunto(
    trayectoria,
    tiempo
  ) {
    if (
      trayectoria.length === 1
    ) {
      return trayectoria[0]
    }

    if (
      tiempo <=
      trayectoria[0].tiempo
    ) {
      return trayectoria[0]
    }

    const ultimo =
      trayectoria[
        trayectoria.length - 1
      ]

    if (
      tiempo >=
      ultimo.tiempo
    ) {
      return ultimo
    }

    for (
      let i = 0;
      i <
      trayectoria.length - 1;
      i += 1
    ) {
      const actual =
        trayectoria[i]

      const siguiente =
        trayectoria[i + 1]

      if (
        tiempo >= actual.tiempo &&
        tiempo <= siguiente.tiempo
      ) {
        const diferencia =
          siguiente.tiempo -
          actual.tiempo

        const factor =
          diferencia > 0
            ? (
                tiempo -
                actual.tiempo
              ) /
              diferencia
            : 0

        return {
          x: interpolar(
            actual.x,
            siguiente.x,
            factor
          ),
          y: interpolar(
            actual.y,
            siguiente.y,
            factor
          ),
          tiempo
        }
      }
    }

    return ultimo
  }

  function animarTrayectoria(
    trayectoria
  ) {
    if (
      !escenarioRef.current ||
      !objetoRef.current ||
      !trayectoria.length
    ) {
      return
    }

    cancelAnimationFrame(
      animacionRef.current
    )

    const rect =
      escenarioRef.current
        .getBoundingClientRect()

    const anchoDisponible =
      rect.width - 170

    const altoDisponible =
      rect.height - 110

    const maxX =
      Math.max(
        ...trayectoria.map(
          punto =>
            Math.abs(punto.x)
        )
      )

    const maxY =
      Math.max(
        ...trayectoria.map(
          punto =>
            Math.abs(punto.y)
        )
      )

    const escalaX =
      maxX > 0
        ? anchoDisponible / maxX
        : 1

    const escalaY =
      maxY > 0
        ? altoDisponible / maxY
        : 1

    const escala =
      Math.min(
        escalaX,
        escalaY,
        13
      )

    const tiempoFinal =
      trayectoria[
        trayectoria.length - 1
      ].tiempo

    let inicio = null

    function frame(tiempoActual) {
      if (inicio === null) {
        inicio = tiempoActual
      }

      const tiempoTranscurrido =
        (
          tiempoActual -
          inicio
        ) / 1000

      const tiempoFisico =
        tiempoTranscurrido * 1.6

      const punto =
        obtenerPunto(
          trayectoria,
          tiempoFisico
        )

      if (
        objetoRef.current &&
        punto
      ) {
        objetoRef.current.style.transform =
          `translate(
            ${punto.x * escala}px,
            ${-punto.y * escala}px
          )`
      }

      if (
        tiempoFisico <
        tiempoFinal
      ) {
        animacionRef.current =
          requestAnimationFrame(
            frame
          )
      }
    }

    animacionRef.current =
      requestAnimationFrame(
        frame
      )
  }

  function reiniciar() {
    cancelAnimationFrame(
      animacionRef.current
    )

    if (
      objetoRef.current
    ) {
      objetoRef.current.style.transform =
        'translate(0px, 0px)'
    }

    setResultado(null)
    setError('')
  }

  return (
    <article className="simulador simulador-lanzar">
      <div className="simulador-cabecera">
        <div>
          <span className="simulador-etiqueta">
            SIMULADOR 02
          </span>

          <h3>
            Lanzamiento
          </h3>
        </div>

        <div className="simulador-gravedad">
          {gravedad} m/s²
        </div>
      </div>

      <div
        ref={escenarioRef}
        className="lanzar-escenario"
        style={{
          backgroundImage:
            fondo
              ? `url("${fondo}")`
              : 'none'
        }}
        onPointerMove={
          actualizarLinea
        }
        onPointerUp={
          terminarArrastre
        }
        onPointerCancel={() => {
          setArrastrando(false)

          setLinea({
            visible: false,
            x: 0,
            y: 0,
            longitud: 0,
            angulo: 0
          })
        }}
      >
        <div className="lanzar-overlay"></div>

        <div className="lanzar-instruccion">
          ARRASTRÁ EL OBJETO
        </div>

        <div className="lanzar-astronauta">
          {astronauta && (
            <img
              src={astronauta}
              alt=""
            />
          )}
        </div>

        <div
          className="lanzar-origen"
          onPointerDown={
            iniciarArrastre
          }
        >
          <div
            ref={objetoRef}
            className="lanzar-objeto"
          />
        </div>

        {linea.visible && (
          <div
            className="lanzar-direccion"
            style={{
              left:
                linea.x,
              top:
                linea.y,
              width:
                `${linea.longitud}px`,
              transform:
                `rotate(${linea.angulo}deg)`
            }}
          />
        )}

        <div className="lanzar-piso"></div>
      </div>

      <div className="simulador-controles lanzar-resultados">
        <div>
          <span>
            Distancia
          </span>

          <strong>
            {resultado
              ? `${resultado.distancia.toFixed(2)} m`
              : '—'
            }
          </strong>
        </div>

        <div>
          <span>
            Altura máxima
          </span>

          <strong>
            {resultado
              ? `${resultado.alturaMaxima.toFixed(2)} m`
              : '—'
            }
          </strong>
        </div>

        <div>
          <span>
            Tiempo
          </span>

          <strong>
            {resultado
              ? `${resultado.duracion.toFixed(2)} s`
              : '—'
            }
          </strong>
        </div>

        <button
          type="button"
          onClick={reiniciar}
        >
          Reiniciar
        </button>
      </div>

      {error && (
        <div className="lanzar-error">
          {error}
        </div>
      )}

      {cargando && (
        <div className="lanzar-cargando">
          Calculando trayectoria...
        </div>
      )}
    </article>
  )
}

export default Simulador_Lanzar