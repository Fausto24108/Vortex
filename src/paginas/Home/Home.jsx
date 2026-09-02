import { Link } from 'react-router-dom'
import videoEspacio from '../../assets/videos/VideoEspacio.mp4'
import sistemaSolarIcono from '../../assets/iconos/Sistema_Solar_Icono.png'
import universoIcono from '../../assets/iconos/Universo_Icono.png'
import crearPlanetaIcono from '../../assets/iconos/Crear_Planeta_Icono.png'
import './Home.css'

function Home() {
  return (
    <main>
      <section className="seccion-principal">
        <video
          className="seccion-principal-video"
          src={videoEspacio}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="seccion-principal-overlay"></div>

        <div className="seccion-principal-contenido">
          <span className="seccion-principal-etiqueta">
            EXPLORA · DESCUBRE · CREA
          </span>

          <h1>
            <span className="seccion-principal-titulo">
              El universo
            </span>

            <span className="seccion-principal-acento">
              está esperando
            </span>
          </h1>

          <p>
            Descubrí los secretos del cosmos, explorá nuestro Sistema Solar
            y creá tus propios mundos.
          </p>

          <div className="seccion-principal-botones">
            <a
              href="#"
              className="primary-button"
            >
              Explorar el universo
              <span>→</span>
            </a>

            <Link
              to="/planetas-comunidad"
              className="secondary-button"
            >
              Crear mi planeta
            </Link>
          </div>
        </div>
      </section>

      <section className="intro">
        <span className="section-label">
          BIENVENIDO A VORTEX
        </span>

        <h2>
          Mucho más que mirar las estrellas.
        </h2>

        <p>
          Aprendé astronomía de una manera diferente. Interactuá con
          planetas, experimentá con la gravedad, descubrí fenómenos del
          universo y construí tus propios mundos.
        </p>
      </section>

      <section className="features">
        <article className="feature-card">
          <span className="feature-number">
            01
          </span>

          <img
            className="feature-icon"
            src={sistemaSolarIcono}
            alt="Sistema Solar"
          />

          <h3>Sistema Solar</h3>

          <p>
            Conocé nuestros planetas y experimentá con sus propiedades
            físicas.
          </p>
        </article>

        <article className="feature-card">
          <span className="feature-number">
            02
          </span>

          <img
            className="feature-icon"
            src={universoIcono}
            alt="Universo"
          />

          <h3>Explorá el universo</h3>

          <p>
            Descubrí nebulosas, agujeros negros, galaxias y otros fenómenos
            cósmicos.
          </p>
        </article>

        <article className="feature-card">
          <span className="feature-number">
            03
          </span>

          <img
            className="feature-icon"
            src={crearPlanetaIcono}
            alt="Crear planeta"
          />

          <h3>Creá tu planeta</h3>

          <p>
            Diseñá tu propio mundo y compartilo con la comunidad de Vortex.
          </p>
        </article>
      </section>
    </main>
  )
}

export default Home