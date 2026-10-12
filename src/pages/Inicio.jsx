import { useNavigate } from 'react-router-dom'

export default function Inicio() {
  const navigate = useNavigate()
  const motorista = localStorage.getItem('motorista')

  function sair() {
    localStorage.removeItem('motorista')
    navigate('/login')
  }

  return (
    <div className="container">
      <div className="topo">
        <div>
          <h1>Olá, {motorista}</h1>
          <small>O que você deseja fazer?</small>
        </div>
        <button onClick={sair}>Sair</button>
      </div>

      <button className="principal" onClick={() => navigate('/checklist')}>
        Checklist pré-rota
      </button>
      <button className="principal secundario" onClick={() => navigate('/pos-rota')}>
        Relato pós-rota
      </button>
    </div>
  )
}