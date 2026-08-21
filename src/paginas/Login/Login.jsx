import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexto/AuthContext'
import './Login.css'

function Login() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarEnvio(event) {
    event.preventDefault()
    setError('')
    setCargando(true)

    try {
      await iniciarSesion(email, password)
      navigate('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="pagina-auth">
      <section className="formulario-auth">
        <span className="auth-etiqueta">BIENVENIDO DE NUEVO</span>
        <h1>Iniciar sesión</h1>
        <p>Volvé a explorar el universo con tu cuenta de Vortex.</p>

        <form onSubmit={manejarEnvio}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-enlace">
          ¿Todavía no tenés una cuenta?
          <Link to="/registro"> Registrate</Link>
        </p>
      </section>
    </main>
  )
}

export default Login