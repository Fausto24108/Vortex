import './App.css'
import videoEspacio from './assets/videos/VideoEspacio.mp4'

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <a href="#" className="logo"><span>✦</span> VORTEX</a>

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
        <section className="hero">
          <video
            className="hero-video"
            src={videoEspacio}
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="hero-overlay"></div>

          <div className="hero-content">
            <span className="eyebrow">EXPLORA · DESCUBRE · CREA</span>

            <h1>
              <span className="hero-title-main">El universo</span>
              <span className="hero-title-accent">está esperando.</span>
            </h1>

            <p>
              Descubrí los secretos del cosmos, explorá nuestro Sistema Solar y creá tus propios mundos.
            </p>

            <div className="hero-buttons">
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
            <span className="feature-icon">◉</span>
            <h3>Sistema Solar</h3>
            <p>Conocé nuestros planetas y experimentá con sus propiedades físicas.</p>
            <a href="#">Explorar →</a>
          </article>

          <article className="feature-card">
            <span className="feature-number">02</span>
            <span className="feature-icon">✦</span>
            <h3>Explorá el universo</h3>
            <p>Descubrí nebulosas, agujeros negros, galaxias y otros fenómenos cósmicos.</p>
            <a href="#">Descubrir →</a>
          </article>

          <article className="feature-card">
            <span className="feature-number">03</span>
            <span className="feature-icon">◌</span>
            <h3>Creá tu planeta</h3>
            <p>Diseñá tu propio mundo y compartilo con la comunidad de Vortex.</p>
            <a href="#">Crear →</a>
          </article>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-logo"><span>✦</span> VORTEX</div>
        <p>Explorando el universo, una idea a la vez.</p>
        <span className="footer-copy">© 2026 Vortex</span>
      </footer>
    </div>
  )
}

export default App