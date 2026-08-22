import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

import { AuthProvider } from './contexto/AuthContext'

import Navbar from './componentes/Navbar'
import Footer from './componentes/Footer'
import RutaProtegida from './componentes/RutaProtegida'

import Home from './paginas/Home/Home'
import Login from './paginas/Login/Login'
import Registro from './paginas/Registro/Registro'
import Sistema_Solar from './paginas/Sistema_Solar/Sistema_Solar'
import Planeta from './paginas/Planetas/Planeta'
import Planetas_Comunidad from './paginas/Planetas_Comunidad/Planetas_Comunidad'
import Crear_Planeta from './paginas/Crear_Planeta/Crear_Planeta'
import Planeta_Custom from './paginas/Planeta_Custom/Planeta_Custom'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/registro"
            element={<Registro />}
          />

          <Route
            path="/sistema-solar"
            element={
              <RutaProtegida>
                <Sistema_Solar />
              </RutaProtegida>
            }
          />

          <Route
            path="/sistema-solar/planeta/:slug"
            element={
              <RutaProtegida>
                <Planeta />
              </RutaProtegida>
            }
          />

          <Route
            path="/planetas-comunidad"
            element={
              <RutaProtegida>
                <Planetas_Comunidad />
              </RutaProtegida>
            }
          />

          <Route
            path="/crear-planeta"
            element={
              <RutaProtegida>
                <Crear_Planeta />
              </RutaProtegida>
            }
          />

          <Route
            path="/planetas/:id"
            element={
              <RutaProtegida>
                <Planeta_Custom />
              </RutaProtegida>
            }
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App