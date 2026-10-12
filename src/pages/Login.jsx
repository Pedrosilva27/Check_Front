import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  function entrar() {
    // Simulação: entra sem validar. O login real vem com o back-end.
    localStorage.setItem('motorista', matricula || 'Motorista')
    navigate('/inicio')
  }

  return (
    <div className="container">
      <h1>Checklist de Motoristas</h1>
      <label>Matrícula</label>
      <input value={matricula} onChange={(e) => setMatricula(e.target.value)} />
      <label>Senha</label>
      <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <button className="principal" onClick={entrar}>Entrar</button>
    </div>
  )
}