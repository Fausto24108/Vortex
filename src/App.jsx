import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexto/AuthContext'
import Navbar from './componentes/Navbar'
import Footer from './componentes/Footer'
import Home from './paginas/Home/Home'
import Login from './paginas/Login/Login'
import Registro from './paginas/Registro/Registro'
import Sistema_Solar from './paginas/Sistema_Solar/Sistema_Solar'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/sistema-solar" element={<Sistema_Solar />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App