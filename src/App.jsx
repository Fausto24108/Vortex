import './App.css'
import videoEspacio from './assets/videos/VideoEspacio.mp4'
import logoVortex from './assets/iconos/LogoVortex.png'
import sistemaSolarIcono from './assets/iconos/Sistema_Solar_Icono.png'
import universoIcono from './assets/iconos/Universo_Icono.png'
import crearPlanetaIcono from './assets/iconos/Crear_Planeta_Icono.png'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <a href="#" className="logo">
          <img src={logoVortex} alt="Vortex" />
        </a>

        <nav className="nav-links">
          <a href="#" className="active">Inicio</a>
          <a href="#">Sistema Solar</a>
          <a href="#">Universo</a>
          <a href="#">Crea tu planeta</a>
          <a href="#">Comunidad</a>
        </nav>

        <div className="nav-actions">
          <a href="#" className="login">Iniciar sesión</a>
          <a href="#" className="register">Registrarse</a>
        </div>
      </header>

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
            <span className="seccion-principal-etiqueta">EXPLORA · DESCUBRE · CREA</span>

            <h1>
              <span className="seccion-principal-titulo">El universo</span>
              <span className="seccion-principal-acento">está esperando</span>
            </h1>

            <p>
              Descubrí los secretos del cosmos, explorá nuestro Sistema Solar y creá tus propios mundos.
            </p>

            <div className="seccion-principal-botones">
              <a href="#" className="primary-button">
                Explorar el universo <span>→</span>
              </a>

              <a href="#" className="secondary-button">
                Crear mi planeta
              </a>
            </div>
          </div>
        </section>

        <section className="intro">
          <span className="section-label">BIENVENIDO A VORTEX</span>

          <h2>Mucho más que mirar las estrellas.</h2>

          <p>
            Aprendé astronomía de una manera diferente. Interactuá con planetas, experimentá con la gravedad, descubrí fenómenos del universo y construí tus propios mundos.
          </p>
        </section>

        <section className="features">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <img className="feature-icon" src={sistemaSolarIcono} alt="Sistema Solar" />
            <h3>Sistema Solar</h3>
            <p>Conocé nuestros planetas y experimentá con sus propiedades físicas.</p>
            <a href="#">Explorar →</a>
          </article>

          <article className="feature-card">
            <span className="feature-number">02</span>
            <img className="feature-icon" src={universoIcono} alt="Universo" />
            <h3>Explorá el universo</h3>
            <p>Descubrí nebulosas, agujeros negros, galaxias y otros fenómenos cósmicos.</p>
            <a href="#">Descubrir →</a>
          </article>

          <article className="feature-card">
            <span className="feature-number">03</span>
            <img className="feature-icon" src={crearPlanetaIcono} alt="Crear planeta" />
            <h3>Creá tu planeta</h3>
            <p>Diseñá tu propio mundo y compartilo con la comunidad de Vortex.</p>
            <a href="#">Crear →</a>
          </article>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-logo">
          <img src={logoVortex} alt="Vortex" />
        </div>

        <p>Explorando el universo</p>

        <span className="footer-copy">©2026 Vortex</span>
      </footer>
    </div>
  )
}

export default App