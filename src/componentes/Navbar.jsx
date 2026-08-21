import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import logoVortex from '../assets/iconos/LogoVortex.png'
import perfilIcono from '../assets/iconos/Perfil.png'
import './Navbar.css'

function Navbar() {
  const { usuario, cerrarSesion } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <img src={logoVortex} alt="Vortex" />
      </Link>

      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/sistema-solar">Sistema Solar</Link>
        <Link to="/universo">Universo</Link>
        <Link to="/crear-planeta">Crea tu planeta</Link>
        <Link to="/comunidad">Comunidad</Link>
      </nav>

      <div className="nav-actions">
        {!usuario ? (
          <>
            <Link to="/login" className="login">Iniciar sesión</Link>
            <Link to="/registro" className="register">Registrarse</Link>
          </>
        ) : (
          <div className="perfil-container">
            <button
              className="perfil-boton"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <img src={perfilIcono} alt="Perfil" className="perfil-icono" />
            </button>

            {menuAbierto && (
              <div className="perfil-menu">
                <span className="perfil-nombre">{usuario.nombre}</span>

                <a href="#" className="perfil-opcion">
                  Perfil
                </a>

                <button onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar