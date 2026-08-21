import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexto/AuthContext'
import Navbar from './componentes/Navbar'
import Home from './paginas/Home/Home'
import Login from './paginas/Login/Login'
import Registro from './paginas/Registro/Registro'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App