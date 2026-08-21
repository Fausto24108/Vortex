import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Sistema_Solar_Orbita.css'

const planetas = [
  {
    nombre: 'Mercurio',
    slug: 'mercurio',
    radio: 10,
    distancia: 80,
    velocidad: 0.00012,
    color: '#929292',
    colorClaro: '#d2d2d2',
    inclinacion: 0.02
  },
  {
    nombre: 'Venus',
    slug: 'venus',
    radio: 14,
    distancia: 125,
    velocidad: 0.00009,
    color: '#d6ae70',
    colorClaro: '#f1d39f',
    inclinacion: 0.01
  },
  {
    nombre: 'Tierra',
    slug: 'tierra',
    radio: 15,
    distancia: 170,
    velocidad: 0.00007,
    color: '#326cca',
    colorClaro: '#70b2ff',
    inclinacion: 0,
    luna: {
      radio: 4,
      distancia: 23,
      velocidad: 0.0004
    }
  },
  {
    nombre: 'Marte',
    slug: 'marte',
    radio: 12,
    distancia: 215,
    velocidad: 0.000055,
    color: '#b94d2d',
    colorClaro: '#e58c62',
    inclinacion: 0.015
  },
  {
    nombre: 'Júpiter',
    slug: 'jupiter',
    radio: 30,
    distancia: 300,
    velocidad: 0.000033,
    color: '#bd8d63',
    colorClaro: '#ead0ad',
    inclinacion: 0.005,
    bandas: true
  },
  {
    nombre: 'Saturno',
    slug: 'saturno',
    radio: 28,
    distancia: 390,
    velocidad: 0.000025,
    color: '#d8c38f',
    colorClaro: '#f2dfad',
    inclinacion: 0.01,
    anillos: true
  },
  {
    nombre: 'Urano',
    slug: 'urano',
    radio: 21,
    distancia: 475,
    velocidad: 0.000018,
    color: '#82cdd4',
    colorClaro: '#c6f0f2',
    inclinacion: 0.008
  },
  {
    nombre: 'Neptuno',
    slug: 'neptuno',
    radio: 21,
    distancia: 560,
    velocidad: 0.000015,
    color: '#4160c9',
    colorClaro: '#7893ed',
    inclinacion: 0.012
  }
]

const DISTANCIA_MAXIMA = 560
const MARGEN = 40
const RADIO_SOL = 48

function crearEstrellas() {
  return Array.from(
    { length: 600 },
    () => ({
      x:
        (Math.random() - 0.5) *
        5200,

      y:
        (Math.random() - 0.5) *
        5200,

      radio:
        Math.random() * 1.5 + 0.2,

      brillo:
        Math.random() *
        Math.PI *
        2,

      velocidadBrillo:
        Math.random() *
          0.002 +
        0.001
    })
  )
}

function Sistema_Solar_Orbita() {
  const canvasRef =
    useRef(null)

  const contenedorRef =
    useRef(null)

  const navigate =
    useNavigate()

  useEffect(() => {
    const canvas =
      canvasRef.current

    const contenedor =
      contenedorRef.current

    if (
      !canvas ||
      !contenedor
    ) {
      return
    }

    const ctx =
      canvas.getContext('2d')

    let ancho = 0
    let alto = 0
    let escala = 1

    let animationId
    let ultimoTiempo = 0

    let camX = 0
    let camY = 0

    let arrastrando = false

    let ultimoMouseX = 0
    let ultimoMouseY = 0

    let mouseX = 0
    let mouseY = 0

    let planetaHovered =
      null

    const estrellas =
      crearEstrellas()

    planetas.forEach(
      planeta => {
        planeta.angulo =
          Math.random() *
          Math.PI *
          2
      }
    )

    function ajustarCanvas() {
      const rect =
        contenedor.getBoundingClientRect()

      const pixelRatio =
        window.devicePixelRatio ||
        1

      ancho = rect.width
      alto = rect.height

      if (
        ancho <= 0 ||
        alto <= 0
      ) {
        return
      }

      canvas.width =
        Math.floor(
          ancho *
            pixelRatio
        )

      canvas.height =
        Math.floor(
          alto *
            pixelRatio
        )

      canvas.style.width =
        `${ancho}px`

      canvas.style.height =
        `${alto}px`

      ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      )

      const espacioHorizontal =
        (
          ancho -
          MARGEN * 2
        ) /
        (
          DISTANCIA_MAXIMA *
          2
        )

      const espacioVertical =
        (
          alto -
          MARGEN * 2
        ) /
        (
          DISTANCIA_MAXIMA *
          2
        )

      escala =
        Math.min(
          espacioHorizontal,
          espacioVertical
        )
    }

    function pantallaAMundo(
      x,
      y
    ) {
      return {
        x:
          (
            x -
            ancho / 2
          ) /
            escala -
          camX,

        y:
          (
            y -
            alto / 2
          ) /
            escala -
          camY
      }
    }

    function mundoAPantalla(
      x,
      y
    ) {
      return {
        x:
          ancho / 2 +
          (
            x +
            camX
          ) *
            escala,

        y:
          alto / 2 +
          (
            y +
            camY
          ) *
            escala
      }
    }

    function dibujarEstrellas(
      tiempo
    ) {
      for (
        const estrella of estrellas
      ) {
        const brillo =
          0.22 +
          0.78 *
            (
              0.5 +
              0.5 *
                Math.sin(
                  tiempo *
                    estrella.velocidadBrillo +
                    estrella.brillo
                )
            )

        ctx.beginPath()

        ctx.fillStyle =
          `rgba(255,255,255,${brillo})`

        ctx.arc(
          estrella.x,
          estrella.y,
          estrella.radio,
          0,
          Math.PI * 2
        )

        ctx.fill()
      }
    }

    function dibujarOrbita(
      planeta
    ) {
      ctx.beginPath()

      ctx.ellipse(
        0,
        0,
        planeta.distancia,
        planeta.distancia *
          (
            1 -
            planeta.inclinacion
          ),
        0,
        0,
        Math.PI * 2
      )

      ctx.strokeStyle =
        'rgba(177,169,216,0.16)'

      ctx.lineWidth =
        1 / escala

      ctx.stroke()
    }

    function dibujarSol(
      tiempo
    ) {
      const radio =
        RADIO_SOL

      const resplandor =
        ctx.createRadialGradient(
          0,
          0,
          radio * 0.2,
          0,
          0,
          radio * 4.2
        )

      resplandor.addColorStop(
        0,
        'rgba(255,231,143,0.95)'
      )

      resplandor.addColorStop(
        0.28,
        'rgba(255,172,62,0.38)'
      )

      resplandor.addColorStop(
        1,
        'rgba(255,120,30,0)'
      )

      ctx.beginPath()

      ctx.arc(
        0,
        0,
        radio * 4.2,
        0,
        Math.PI * 2
      )

      ctx.fillStyle =
        resplandor

      ctx.fill()

      const nucleo =
        ctx.createRadialGradient(
          -radio * 0.3,
          -radio * 0.35,
          radio * 0.1,
          0,
          0,
          radio
        )

      nucleo.addColorStop(
        0,
        '#fffde7'
      )

      nucleo.addColorStop(
        0.45,
        '#ffd76b'
      )

      nucleo.addColorStop(
        1,
        '#ff791f'
      )

      ctx.beginPath()

      ctx.arc(
        0,
        0,
        radio,
        0,
        Math.PI * 2
      )

      ctx.fillStyle =
        nucleo

      ctx.fill()

      ctx.globalAlpha =
        0.5

      for (
        let i = 0;
        i < 7;
        i += 1
      ) {
        const angulo =
          (
            i / 7
          ) *
            Math.PI *
            2 +
          tiempo *
            0.00015

        const distancia =
          radio *
            0.55 +
          Math.sin(
            tiempo *
              0.002 +
            i
          ) *
            5

        ctx.beginPath()

        ctx.fillStyle =
          '#ffe69b'

        ctx.arc(
          Math.cos(
            angulo
          ) *
            distancia,

          Math.sin(
            angulo
          ) *
            distancia,

          radio * 0.16,

          0,

          Math.PI * 2
        )

        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    function dibujarPlaneta(
      planeta,
      x,
      y,
      radio,
      tiempo
    ) {
      ctx.save()

      ctx.translate(
        x,
        y
      )

      const gradiente =
        ctx.createRadialGradient(
          -radio * 0.35,
          -radio * 0.35,
          radio * 0.1,
          0,
          0,
          radio * 1.1
        )

      gradiente.addColorStop(
        0,
        planeta.colorClaro
      )

      gradiente.addColorStop(
        0.5,
        planeta.color
      )

      gradiente.addColorStop(
        1,
        '#08090c'
      )

      ctx.beginPath()

      ctx.arc(
        0,
        0,
        radio,
        0,
        Math.PI * 2
      )

      ctx.fillStyle =
        gradiente

      ctx.fill()

      if (
        planeta.bandas
      ) {
        ctx.save()

        ctx.clip()

        for (
          let i =
            -radio;
          i <
            radio;
          i +=
            radio / 4
        ) {
          ctx.fillStyle =
            `rgba(255,255,255,${
              0.05 +
              Math.abs(
                Math.sin(i)
              ) *
                0.04
            })`

          ctx.fillRect(
            -radio,
            i,
            radio * 2,
            radio / 5
          )
        }

        ctx.restore()
      }

      ctx.save()

      ctx.clip()
      ctx.globalAlpha =
        0.13

      for (
        let i = 0;
        i < 5;
        i += 1
      ) {
        const angulo =
          (
            i / 5
          ) *
            Math.PI *
            2 +
          tiempo *
            0.0001

        ctx.beginPath()

        ctx.fillStyle =
          '#050505'

        ctx.arc(
          Math.cos(
            angulo
          ) *
            radio *
            0.45,

          Math.sin(
            angulo
          ) *
            radio *
            0.28,

          radio * 0.16,

          0,

          Math.PI * 2
        )

        ctx.fill()
      }

      ctx.restore()

      if (
        planeta.anillos
      ) {
        ctx.save()

        ctx.rotate(
          0.32
        )

        ctx.scale(
          1,
          0.35
        )

        ctx.beginPath()

        ctx.arc(
          0,
          0,
          radio * 2.15,
          0,
          Math.PI * 2
        )

        ctx.strokeStyle =
          'rgba(240,220,175,0.72)'

        ctx.lineWidth =
          radio * 0.42

        ctx.stroke()

        ctx.beginPath()

        ctx.arc(
          0,
          0,
          radio * 1.7,
          0,
          Math.PI * 2
        )

        ctx.strokeStyle =
          'rgba(170,150,110,0.4)'

        ctx.lineWidth =
          radio * 0.12

        ctx.stroke()

        ctx.restore()
      }

      ctx.restore()
    }

    function dibujarTooltip() {
      if (
        !planetaHovered
      ) {
        return
      }

      const posicion =
        mundoAPantalla(
          planetaHovered.x,
          planetaHovered.y
        )

      ctx.save()

      const texto =
        planetaHovered.nombre

      ctx.font =
        '600 12px Inter, system-ui, sans-serif'

      const anchoTexto =
        ctx.measureText(
          texto
        ).width

      const anchoCaja =
        anchoTexto + 22

      const altoCaja =
        28

      const x =
        posicion.x + 14

      const y =
        posicion.y - 42

      ctx.fillStyle =
        'rgba(8,9,16,0.92)'

      ctx.strokeStyle =
        'rgba(190,177,245,0.25)'

      ctx.lineWidth = 1

      ctx.beginPath()

      ctx.roundRect(
        x,
        y,
        anchoCaja,
        altoCaja,
        8
      )

      ctx.fill()
      ctx.stroke()

      ctx.fillStyle =
        '#f4f1ff'

      ctx.textBaseline =
        'middle'

      ctx.fillText(
        texto,
        x + 11,
        y +
          altoCaja / 2
      )

      ctx.restore()
    }

    function dibujar(
      tiempo
    ) {
      const deltaTiempo =
        Math.min(
          tiempo -
            ultimoTiempo,
          50
        )

      ultimoTiempo =
        tiempo

      if (
        ancho <= 0 ||
        alto <= 0 ||
        escala <= 0
      ) {
        animationId =
          requestAnimationFrame(
            dibujar
          )

        return
      }

      ctx.clearRect(
        0,
        0,
        ancho,
        alto
      )

      const fondo =
        ctx.createRadialGradient(
          ancho / 2,
          alto / 2,
          10,
          ancho / 2,
          alto / 2,
          Math.max(
            ancho,
            alto
          ) *
            0.75
        )

      fondo.addColorStop(
        0,
        '#101327'
      )

      fondo.addColorStop(
        0.48,
        '#070914'
      )

      fondo.addColorStop(
        1,
        '#020308'
      )

      ctx.fillStyle =
        fondo

      ctx.fillRect(
        0,
        0,
        ancho,
        alto
      )

      ctx.save()

      ctx.translate(
        ancho / 2,
        alto / 2
      )

      ctx.scale(
        escala,
        escala
      )

      ctx.translate(
        camX,
        camY
      )

      dibujarEstrellas(
        tiempo
      )

      for (
        const planeta of planetas
      ) {
        dibujarOrbita(
          planeta
        )
      }

      dibujarSol(
        tiempo
      )

      const mouseMundo =
        pantallaAMundo(
          mouseX,
          mouseY
        )

      planetaHovered =
        null

      const distanciaAlSol =
        Math.hypot(
          mouseMundo.x,
          mouseMundo.y
        )

      if (
        distanciaAlSol <
        RADIO_SOL + 12
      ) {
        planetaHovered = {
          nombre: 'Sol',
          slug: 'sol',
          x: 0,
          y: 0,
          esSol: true
        }
      }

      for (
        const planeta of planetas
      ) {
        planeta.angulo +=
          planeta.velocidad *
          deltaTiempo

        const x =
          Math.cos(
            planeta.angulo
          ) *
          planeta.distancia

        const y =
          Math.sin(
            planeta.angulo
          ) *
          planeta.distancia *
          (
            1 -
            planeta.inclinacion
          )

        dibujarPlaneta(
          planeta,
          x,
          y,
          planeta.radio,
          tiempo
        )

        if (
          planeta.luna
        ) {
          const anguloLuna =
            tiempo *
            planeta.luna.velocidad

          const lunaX =
            x +
            Math.cos(
              anguloLuna
            ) *
            planeta.luna.distancia

          const lunaY =
            y +
            Math.sin(
              anguloLuna
            ) *
            planeta.luna.distancia

          ctx.beginPath()

          ctx.arc(
            lunaX,
            lunaY,
            planeta.luna.radio,
            0,
            Math.PI * 2
          )

          ctx.fillStyle =
            '#c7c8cf'

          ctx.fill()
        }

        const distanciaMouse =
          Math.hypot(
            mouseMundo.x -
              x,
            mouseMundo.y -
              y
          )

        if (
          distanciaMouse <
          planeta.radio +
            10
        ) {
          planetaHovered = {
            ...planeta,
            x,
            y
          }
        }
      }

      ctx.restore()

      dibujarTooltip()

      animationId =
        requestAnimationFrame(
          dibujar
        )
    }

    function obtenerMouse(
      event
    ) {
      const rect =
        canvas.getBoundingClientRect()

      mouseX =
        event.clientX -
        rect.left

      mouseY =
        event.clientY -
        rect.top
    }

    function mouseDown(
      event
    ) {
      arrastrando =
        true

      ultimoMouseX =
        event.clientX

      ultimoMouseY =
        event.clientY

      canvas.classList.add(
        'arrastrando'
      )
    }

    function mouseMove(
      event
    ) {
      obtenerMouse(
        event
      )

      if (
        !arrastrando
      ) {
        return
      }

      camX +=
        (
          event.clientX -
          ultimoMouseX
        ) /
        escala

      camY +=
        (
          event.clientY -
          ultimoMouseY
        ) /
        escala

      ultimoMouseX =
        event.clientX

      ultimoMouseY =
        event.clientY
    }

    function mouseUp() {
      arrastrando =
        false

      canvas.classList.remove(
        'arrastrando'
      )
    }

    function clickCanvas() {
      if (
        !planetaHovered ||
        arrastrando
      ) {
        return
      }

      navigate(
        `/sistema-solar/planeta/${planetaHovered.slug}`
      )
    }

    ajustarCanvas()

    requestAnimationFrame(
      () => {
        ajustarCanvas()
      }
    )

    window.addEventListener(
      'resize',
      ajustarCanvas
    )

    canvas.addEventListener(
      'mousedown',
      mouseDown
    )

    window.addEventListener(
      'mousemove',
      mouseMove
    )

    window.addEventListener(
      'mouseup',
      mouseUp
    )

    canvas.addEventListener(
      'click',
      clickCanvas
    )

    animationId =
      requestAnimationFrame(
        dibujar
      )

    return () => {
      cancelAnimationFrame(
        animationId
      )

      window.removeEventListener(
        'resize',
        ajustarCanvas
      )

      canvas.removeEventListener(
        'mousedown',
        mouseDown
      )

      window.removeEventListener(
        'mousemove',
        mouseMove
      )

      window.removeEventListener(
        'mouseup',
        mouseUp
      )

      canvas.removeEventListener(
        'click',
        clickCanvas
      )
    }
  }, [navigate])

  return (
    <div
      ref={contenedorRef}
      className="sistema-orbita-contenedor"
    >
      <canvas
        ref={canvasRef}
      />
    </div>
  )
}

export default Sistema_Solar_Orbita