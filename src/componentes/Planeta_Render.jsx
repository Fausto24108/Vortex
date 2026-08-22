import './Planeta_Render.css'

const colores = {
  rojo: {
    base: '#9c453d',
    luz: '#d87967',
    sombra: '#301313'
  },
  naranja: {
    base: '#b86a36',
    luz: '#e5a060',
    sombra: '#472112'
  },
  amarillo: {
    base: '#b59a3d',
    luz: '#eadb77',
    sombra: '#463c15'
  },
  verde: {
    base: '#4f8956',
    luz: '#87c480',
    sombra: '#1b3921'
  },
  azul: {
    base: '#416fa7',
    luz: '#79b8e8',
    sombra: '#142846'
  },
  celeste: {
    base: '#5ea6b9',
    luz: '#a7e6ef',
    sombra: '#173b47'
  },
  violeta: {
    base: '#70539c',
    luz: '#b68de8',
    sombra: '#291947'
  },
  gris: {
    base: '#777b83',
    luz: '#bec2c8',
    sombra: '#292c31'
  }
}

const tamaños = {
  pequeño: 120,
  mediano: 160,
  grande: 210,
  gigante: 280
}

const tamañosPorDiametro = {
  5000: 'pequeño',
  10000: 'mediano',
  20000: 'grande',
  60000: 'gigante'
}

function Planeta_Render({
  tipo = 'rocoso',
  color = 'azul',
  tamano,
  diametro,
  className = ''
}) {
  const paleta =
    colores[color] || colores.azul

  const tamanoFinal =
    tamano ||
    tamañosPorDiametro[diametro] ||
    'mediano'

  const tamañoVisual =
    tamaños[tamanoFinal] ||
    tamaños.mediano

  return (
    <div
      className={`planeta-render ${className}`}
      style={{
        width: `${tamañoVisual}px`,
        height: `${tamañoVisual}px`,
        '--color-base': paleta.base,
        '--color-luz': paleta.luz,
        '--color-sombra': paleta.sombra
      }}
    >
      <div
        className={`planeta-esfera planeta-tipo-${tipo}`}
      >
        <div className="planeta-atmosfera"></div>
        <div className="planeta-textura"></div>
        <div className="planeta-detalles"></div>

        {tipo === 'gaseoso' && (
          <div className="planeta-bandas"></div>
        )}

        {tipo === 'gigante-helado' && (
          <div className="planeta-capas-heladas"></div>
        )}

        {tipo === 'rocoso' && (
          <div className="planeta-crateres"></div>
        )}

        <div className="planeta-iluminacion"></div>
        <div className="planeta-sombra"></div>
      </div>
    </div>
  )
}

export default Planeta_Render