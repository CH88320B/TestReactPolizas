import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ListarPolizas } from "./components/ListarPolizas"
import {EditarPoliza} from "./components/EditarPoliza"
import {NuevaPoliza} from "./components/NuevaPoliza" 
import { Login } from "./pages/Login"
import { authService } from "./services/authService"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated())

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(authService.isAuthenticated())

    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login"   element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}  />
        <Route path="/polizas" element={isAuthenticated ? <ListarPolizas /> : <Navigate to="/login" />} />
        <Route path="/nuevaPoliza"   element={isAuthenticated ? <NuevaPoliza /> : <Navigate to="/login" />}/>
      <Route  path="/editarPoliza/:numeroPoliza" element={isAuthenticated ? <EditarPoliza /> : <Navigate to="/login" />}
       />
     </Routes>
    </BrowserRouter>
  )
}

export default App
