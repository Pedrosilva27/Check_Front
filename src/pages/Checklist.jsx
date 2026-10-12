import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  onibus,
  rotas,
  itens,
  niveisCombustivel,
  defeitosAbertos,
} from '../data/itens'

const categorias = [...new Set(itens.map((i) => i.categoria))]

export default function Checklist() {
  const navigate = useNavigate()
  const motorista = localStorage.getItem('motorista')

  const [onibusId, setOnibusId] = useState('')
  const [rota, setRota] = useState('')
  const [km, setKm] = useState('')
  const [combustivel, setCombustivel] = useState('')
  const [respostas, setRespostas] = useState({})
  const [defeitosStatus, setDefeitosStatus] = useState({})
  const [obsGeral, setObsGeral] = useState('')
  const [resultado, setResultado] = useState(null)

  const defeitosDoOnibus = defeitosAbertos[onibusId] || []
  const respondidos = itens.filter((i) => respostas[i.id]?.status).length
  const progresso = Math.round((respondidos / itens.length) * 100)

  function responder(id, campo, valor) {
    setRespostas((atual) => ({
      ...atual,
      [id]: { ...atual[id], [campo]: valor },
    }))
  }

  function anexarFoto(id, arquivo) {
    if (!arquivo) return
    const leitor = new FileReader()
    leitor.onload = () => responder(id, 'foto', leitor.result)
    leitor.readAsDataURL(arquivo)
  }

  function novoChecklist() {
    setOnibusId('')
    setRota('')
    setKm('')
    setCombustivel('')
    setRespostas({})
    setDefeitosStatus({})
    setObsGeral('')
    setResultado(null)
  }

  function finalizar() {
    if (!onibusId || !rota || !km || !combustivel) {
      alert('Preencha ônibus, rota, quilometragem e combustível')
      return
    }
    for (const d of defeitosDoOnibus) {
      if (!defeitosStatus[d.id]) {
        alert(`Informe a situação do defeito: ${d.descricao}`)
        return
      }
    }
    for (const item of itens) {
      const r = respostas[item.id]
      if (!r?.status) {
        alert(`Responda: ${item.descricao}`)
        return
      }
      if (r.status === 'problema' && !r.obs) {
        alert(`Descreva o problema em: ${item.descricao}`)
        return
      }
    }

    const comProblema = itens.filter((i) => respostas[i.id].status === 'problema')
    const bloqueios = comProblema.filter((i) => i.critico)
    const defeitosPersistentes = defeitosDoOnibus.filter(
      (d) => defeitosStatus[d.id] === 'presente'
    )

    const checklist = {
      id: crypto.randomUUID(),
      motorista,
      onibusId,
      rota,
      km,
      combustivel,
      data: new Date().toISOString(),
      respostas,
      defeitosStatus,
      obsGeral,
      liberado: bloqueios.length === 0,
    }

    // Guarda ônibus e rota para o relato pós-rota abrir preenchido
    localStorage.setItem('viagemAtual', JSON.stringify({ onibusId, rota }))

    console.log(checklist) // depois: enviar para a API / salvar offline
    setResultado({
      liberado: checklist.liberado,
      bloqueios,
      pendencias: comProblema.filter((i) => !i.critico),
      defeitosPersistentes,
    })
  }

  if (resultado) {
    return (
      <div className="container">
        {resultado.liberado ? (
          <h2 className="ok">Veículo liberado. Boa viagem!</h2>
        ) : (
          <>
            <h2 className="erro">Saída bloqueada</h2>
            <p>Itens críticos com problema:</p>
            <ul>
              {resultado.bloqueios.map((b) => (
                <li key={b.id}>{b.descricao}</li>
              ))}
            </ul>
            <p>Avise a manutenção ou o supervisor.</p>
          </>
        )}

        {resultado.pendencias.length > 0 && (
          <>
            <h3>Pendências registradas</h3>
            <ul>
              {resultado.pendencias.map((p) => (
                <li key={p.id}>{p.descricao}</li>
              ))}
            </ul>
          </>
        )}

        {resultado.defeitosPersistentes.length > 0 && (
          <>
            <h3>Defeitos anteriores ainda presentes</h3>
            <ul>
              {resultado.defeitosPersistentes.map((d) => (
                <li key={d.id}>{d.descricao}</li>
              ))}
            </ul>
          </>
        )}

        <button className="principal" onClick={() => navigate('/inicio')}>
          Voltar ao início
        </button>
        <button className="principal secundario" onClick={novoChecklist}>
          Novo checklist
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="topo">
        <div>
          <h1>Checklist pré-rota</h1>
          <small>
            Motorista: {motorista} · {new Date().toLocaleDateString('pt-BR')}
          </small>
        </div>
        <button onClick={() => navigate('/inicio')}>Início</button>
      </div>

      <div className="barra">
        <div className="barra-preenchida" style={{ width: `${progresso}%` }} />
      </div>
      <small>
        {respondidos} de {itens.length} itens respondidos
      </small>

      <section>
        <h2>Dados da viagem</h2>

        <label>Ônibus</label>
        <select value={onibusId} onChange={(e) => setOnibusId(e.target.value)}>
          <option value="">Selecione</option>
          {onibus.map((o) => (
            <option key={o.id} value={o.id}>
              {o.prefixo} - {o.placa}
            </option>
          ))}
        </select>

        <label>Rota</label>
        <select value={rota} onChange={(e) => setRota(e.target.value)}>
          <option value="">Selecione</option>
          {rotas.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <label>Quilometragem atual</label>
        <input
          type="number"
          inputMode="numeric"
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />

        <label>Nível de combustível</label>
        <div className="opcoes">
          {niveisCombustivel.map((n) => (
            <button
              key={n}
              className={combustivel === n ? 'sel ok' : ''}
              onClick={() => setCombustivel(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {defeitosDoOnibus.length > 0 && (
        <section>
          <h2>Defeitos já registrados neste ônibus</h2>
          {defeitosDoOnibus.map((d) => (
            <div className="item" key={d.id}>
              <p>{d.descricao}</p>
              <div className="opcoes">
                <button
                  className={defeitosStatus[d.id] === 'presente' ? 'sel problema' : ''}
                  onClick={() => setDefeitosStatus({ ...defeitosStatus, [d.id]: 'presente' })}
                >
                  Ainda presente
                </button>
                <button
                  className={defeitosStatus[d.id] === 'corrigido' ? 'sel ok' : ''}
                  onClick={() => setDefeitosStatus({ ...defeitosStatus, [d.id]: 'corrigido' })}
                >
                  Corrigido
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {categorias.map((cat) => (
        <section key={cat}>
          <h2>{cat}</h2>
          {itens
            .filter((i) => i.categoria === cat)
            .map((item) => {
              const r = respostas[item.id]
              return (
                <div
                  className={`item ${r?.status === 'problema' ? 'item-problema' : ''}`}
                  key={item.id}
                >
                  <p>
                    {item.descricao}{' '}
                    {item.critico && <span className="tag">crítico</span>}
                  </p>
                  <div className="opcoes">
                    {['ok', 'problema', 'na'].map((s) => (
                      <button
                        key={s}
                        className={r?.status === s ? `sel ${s}` : ''}
                        onClick={() => responder(item.id, 'status', s)}
                      >
                        {s === 'ok' ? 'OK' : s === 'problema' ? 'Problema' : 'N/A'}
                      </button>
                    ))}
                  </div>

                  {r?.status === 'problema' && (
                    <>
                      <textarea
                        placeholder="Descreva o problema"
                        value={r.obs || ''}
                        onChange={(e) => responder(item.id, 'obs', e.target.value)}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => anexarFoto(item.id, e.target.files[0])}
                      />
                      {r.foto && (
                        <img className="foto" src={r.foto} alt="Foto do problema" />
                      )}
                    </>
                  )}
                </div>
              )
            })}
        </section>
      ))}

      <section>
        <h2>Observações gerais</h2>
        <textarea
          placeholder="Algo mais que a manutenção precise saber (opcional)"
          value={obsGeral}
          onChange={(e) => setObsGeral(e.target.value)}
        />
      </section>

      <button className="principal" onClick={finalizar}>
        Finalizar checklist
      </button>
    </div>
  )
}