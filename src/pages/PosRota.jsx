import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onibus, rotas, niveisCombustivel } from '../data/itens'

const tiposOcorrencia = [
  'Acidente',
  'Pane mecânica',
  'Avaria no veículo',
  'Problema com passageiro',
  'Segurança (assalto, ameaça)',
  'Atraso / trânsito',
  'Outro',
]

const gravidades = ['Leve', 'Média', 'Grave']

function horaAtual() {
  return new Date().toTimeString().slice(0, 5)
}

function novaOcorrencia() {
  return {
    id: crypto.randomUUID(),
    tipo: '',
    gravidade: '',
    hora: horaAtual(),
    local: '',
    descricao: '',
    precisaManutencao: null,
    fotos: [],
  }
}

export default function PosRota() {
  const navigate = useNavigate()
  const motorista = localStorage.getItem('motorista')
  const viagem = JSON.parse(localStorage.getItem('viagemAtual') || '{}')

  const [onibusId, setOnibusId] = useState(viagem.onibusId || '')
  const [rota, setRota] = useState(viagem.rota || '')
  const [kmFinal, setKmFinal] = useState('')
  const [combustivel, setCombustivel] = useState('')
  const [houve, setHouve] = useState(null)
  const [ocorrencias, setOcorrencias] = useState([])
  const [obsFinal, setObsFinal] = useState('')
  const [resultado, setResultado] = useState(null)

  function escolherHouve(valor) {
    setHouve(valor)
    if (valor && ocorrencias.length === 0) {
      setOcorrencias([novaOcorrencia()])
    }
  }

  function atualizar(id, campo, valor) {
    setOcorrencias((lista) =>
      lista.map((o) => (o.id === id ? { ...o, [campo]: valor } : o))
    )
  }

  function remover(id) {
    setOcorrencias((lista) => lista.filter((o) => o.id !== id))
  }

  function anexarFotos(id, arquivos) {
    Array.from(arquivos).forEach((arquivo) => {
      const leitor = new FileReader()
      leitor.onload = () =>
        setOcorrencias((lista) =>
          lista.map((o) =>
            o.id === id ? { ...o, fotos: [...o.fotos, leitor.result] } : o
          )
        )
      leitor.readAsDataURL(arquivo)
    })
  }

  function finalizar() {
    if (!onibusId || !rota || !kmFinal || !combustivel) {
      alert('Preencha ônibus, rota, quilometragem final e combustível')
      return
    }
    if (houve === null) {
      alert('Informe se aconteceu algo durante a rota')
      return
    }
    if (houve) {
      if (ocorrencias.length === 0) {
        alert('Adicione pelo menos uma ocorrência ou marque "Não"')
        return
      }
      for (const o of ocorrencias) {
        if (!o.tipo || !o.gravidade || !o.descricao) {
          alert('Preencha tipo, gravidade e descrição de todas as ocorrências')
          return
        }
        if (o.precisaManutencao === null) {
          alert('Informe se o veículo precisa de manutenção em cada ocorrência')
          return
        }
      }
    }

    const relato = {
      id: crypto.randomUUID(),
      motorista,
      onibusId,
      rota,
      kmFinal,
      combustivel,
      data: new Date().toISOString(),
      houveOcorrencia: houve,
      ocorrencias: houve ? ocorrencias : [],
      obsFinal,
    }

    console.log(relato) // depois: enviar para a API / salvar offline
    localStorage.removeItem('viagemAtual')

    setResultado({
      urgente: relato.ocorrencias.some(
        (o) => o.gravidade === 'Grave' || o.tipo === 'Acidente'
      ),
      manutencao: relato.ocorrencias.some((o) => o.precisaManutencao),
      total: relato.ocorrencias.length,
    })
  }

  if (resultado) {
    return (
      <div className="container">
        <h2 className="ok">Relato enviado</h2>
        {resultado.total === 0 ? (
          <p>Rota encerrada sem ocorrências.</p>
        ) : (
          <p>{resultado.total} ocorrência(s) registrada(s).</p>
        )}
        {resultado.urgente && (
          <p className="erro">
            Há ocorrência grave ou acidente. Comunique imediatamente o supervisor.
          </p>
        )}
        {resultado.manutencao && (
          <p>O veículo será sinalizado para a manutenção.</p>
        )}
        <button className="principal" onClick={() => navigate('/inicio')}>
          Voltar ao início
        </button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="topo">
        <div>
          <h1>Relato pós-rota</h1>
          <small>
            Motorista: {motorista} · {new Date().toLocaleDateString('pt-BR')}
          </small>
        </div>
        <button onClick={() => navigate('/inicio')}>Início</button>
      </div>

      <section>
        <h2>Encerramento da rota</h2>

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

        <label>Quilometragem final</label>
        <input
          type="number"
          inputMode="numeric"
          value={kmFinal}
          onChange={(e) => setKmFinal(e.target.value)}
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

      <section>
        <h2>Aconteceu algo durante a rota?</h2>
        <div className="opcoes">
          <button
            className={houve === false ? 'sel ok' : ''}
            onClick={() => escolherHouve(false)}
          >
            Não
          </button>
          <button
            className={houve === true ? 'sel problema' : ''}
            onClick={() => escolherHouve(true)}
          >
            Sim
          </button>
        </div>
      </section>

      {houve &&
        ocorrencias.map((o, indice) => (
          <section className="item item-problema" key={o.id}>
            <div className="topo">
              <h2 style={{ margin: 0 }}>Ocorrência {indice + 1}</h2>
              {ocorrencias.length > 1 && (
                <button onClick={() => remover(o.id)}>Remover</button>
              )}
            </div>

            <label>Tipo</label>
            <select value={o.tipo} onChange={(e) => atualizar(o.id, 'tipo', e.target.value)}>
              <option value="">Selecione</option>
              {tiposOcorrencia.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <label>Gravidade</label>
            <div className="opcoes">
              {gravidades.map((g) => (
                <button
                  key={g}
                  className={
                    o.gravidade === g
                      ? `sel ${g === 'Leve' ? 'ok' : g === 'Média' ? 'na' : 'problema'}`
                      : ''
                  }
                  onClick={() => atualizar(o.id, 'gravidade', g)}
                >
                  {g}
                </button>
              ))}
            </div>

            <label>Horário aproximado</label>
            <input
              type="time"
              value={o.hora}
              onChange={(e) => atualizar(o.id, 'hora', e.target.value)}
            />

            <label>Local</label>
            <input
              placeholder="Rua, ponto de parada, km da rodovia..."
              value={o.local}
              onChange={(e) => atualizar(o.id, 'local', e.target.value)}
            />

            <label>O que aconteceu?</label>
            <textarea
              placeholder="Descreva com detalhes"
              value={o.descricao}
              onChange={(e) => atualizar(o.id, 'descricao', e.target.value)}
            />

            <label>O veículo precisa de manutenção?</label>
            <div className="opcoes">
              <button
                className={o.precisaManutencao === false ? 'sel ok' : ''}
                onClick={() => atualizar(o.id, 'precisaManutencao', false)}
              >
                Não
              </button>
              <button
                className={o.precisaManutencao === true ? 'sel problema' : ''}
                onClick={() => atualizar(o.id, 'precisaManutencao', true)}
              >
                Sim
              </button>
            </div>

            <label>Fotos</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => anexarFotos(o.id, e.target.files)}
            />
            {o.fotos.map((foto, i) => (
              <img key={i} className="foto" src={foto} alt={`Foto ${i + 1}`} />
            ))}
          </section>
        ))}

      {houve && (
        <button onClick={() => setOcorrencias([...ocorrencias, novaOcorrencia()])}>
          + Adicionar outra ocorrência
        </button>
      )}

      <section>
        <h2>Observações finais</h2>
        <textarea
          placeholder="Opcional"
          value={obsFinal}
          onChange={(e) => setObsFinal(e.target.value)}
        />
      </section>

      <button className="principal" onClick={finalizar}>
        Enviar relato
      </button>
    </div>
  )
}