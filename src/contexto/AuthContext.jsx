import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setCargando(false)
      return
    }

    fetch('http://localhost:3001/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Sesión inválida')
        }

        return response.json()
      })
      .then(data => {
        setUsuario(data.usuario)
      })
      .catch(() => {
        localStorage.removeItem('token')
        setUsuario(null)
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  async function iniciarSesion(email, password) {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.mensaje)
    }

    localStorage.setItem('token', data.token)
    setUsuario(data.usuario)
  }

  async function registrar(nombre, email, password) {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.mensaje)
    }

    localStorage.setItem('token', data.token)
    setUsuario(data.usuario)
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        iniciarSesion,
        registrar,
        cerrarSesion
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}