import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  const location = useLocation()

  if (cargando) {
    return null
  }

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          desde: location.pathname
        }}
      />
    )
  }

  return children
}

export default RutaProtegida