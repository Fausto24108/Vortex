import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexto/AuthContext'
import './Registro.css'

function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarEnvio(event) {
    event.preventDefault()
    setError('')

    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden')
      return
    }

    setCargando(true)

    try {
      await registrar(nombre, email, password)
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
        <span className="auth-etiqueta">FORMÁ PARTE DE VORTEX</span>
        <h1>Crear cuenta</h1>
        <p>Creá tu cuenta y empezá a explorar el universo.</p>

        <form onSubmit={manejarEnvio}>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={event => setNombre(event.target.value)}
            required
          />

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

          <label htmlFor="confirmacion">Repetir contraseña</label>
          <input
            id="confirmacion"
            type="password"
            value={confirmacion}
            onChange={event => setConfirmacion(event.target.value)}
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-enlace">
          ¿Ya tenés una cuenta?
          <Link to="/login"> Iniciá sesión</Link>
        </p>
      </section>
    </main>
  )
}

export default Registro