import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import Checklist from './pages/Checklist'
import PosRota from './pages/PosRota'

function Protegida({ children }) {
  const motorista = localStorage.getItem('motorista')
  return motorista ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inicio" element={<Protegida><Inicio /></Protegida>} />
      <Route path="/checklist" element={<Protegida><Checklist /></Protegida>} />
      <Route path="/pos-rota" element={<Protegida><PosRota /></Protegida>} />
    </Routes>
  )
}