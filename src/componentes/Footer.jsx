import logoVortex from '../assets/iconos/LogoVortex.png'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={logoVortex} alt="Vortex" />
      </div>

      <p>Explorando el universo</p>

      <span className="footer-copy">
        ©2026 Vortex
      </span>
    </footer>
  )
}

export default Footer