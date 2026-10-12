export const onibus = [
  { id: 1, prefixo: '1020', placa: 'ABC-1D23' },
  { id: 2, prefixo: '1021', placa: 'DEF-4G56' },
]

export const rotas = ['Linha 101', 'Linha 205', 'Linha 310']

export const niveisCombustivel = ['Reserva', '1/4', '1/2', '3/4', 'Cheio']

// Defeitos já registrados por ônibus (exemplo; depois virá do banco)
export const defeitosAbertos = {
  1: [
    { id: 101, descricao: 'Ar-condicionado com pouca refrigeração' },
    { id: 102, descricao: 'Banco 12 com encosto solto' },
  ],
  2: [],
}

export const itens = [
  // Pneus
  { id: 1, categoria: 'Pneus', descricao: 'Calibragem dos pneus', critico: true },
  { id: 2, categoria: 'Pneus', descricao: 'Desgaste, cortes ou bolhas', critico: true },
  { id: 3, categoria: 'Pneus', descricao: 'Parafusos das rodas', critico: true },
  { id: 4, categoria: 'Pneus', descricao: 'Estepe em condições de uso', critico: false },

  // Água e fluidos
  { id: 5, categoria: 'Água e fluidos', descricao: 'Nível de água do radiador', critico: true },
  { id: 6, categoria: 'Água e fluidos', descricao: 'Nível de óleo do motor', critico: true },
  { id: 7, categoria: 'Água e fluidos', descricao: 'Fluido de freio', critico: true },
  { id: 8, categoria: 'Água e fluidos', descricao: 'Água do limpador de para-brisa', critico: false },
  { id: 9, categoria: 'Água e fluidos', descricao: 'Vazamentos sob o veículo', critico: true },

  // Vidros e espelhos
  { id: 10, categoria: 'Vidros e espelhos', descricao: 'Para-brisa sem trincas', critico: true },
  { id: 11, categoria: 'Vidros e espelhos', descricao: 'Vidros laterais e traseiro', critico: false },
  { id: 12, categoria: 'Vidros e espelhos', descricao: 'Espelhos retrovisores', critico: true },
  { id: 13, categoria: 'Vidros e espelhos', descricao: 'Palhetas do limpador', critico: false },

  // Freios e direção
  { id: 14, categoria: 'Freios e direção', descricao: 'Freio de serviço e de estacionamento', critico: true },
  { id: 15, categoria: 'Freios e direção', descricao: 'Direção sem folga ou barulho', critico: true },
  { id: 16, categoria: 'Freios e direção', descricao: 'Buzina', critico: false },

  // Luzes e sinalização
  { id: 17, categoria: 'Luzes e sinalização', descricao: 'Faróis (baixo e alto)', critico: true },
  { id: 18, categoria: 'Luzes e sinalização', descricao: 'Lanternas e luz de freio', critico: true },
  { id: 19, categoria: 'Luzes e sinalização', descricao: 'Setas e pisca-alerta', critico: true },

  // Interior e segurança
  { id: 20, categoria: 'Interior e segurança', descricao: 'Portas abrindo e fechando', critico: true },
  { id: 21, categoria: 'Interior e segurança', descricao: 'Extintor dentro da validade', critico: true },
  { id: 22, categoria: 'Interior e segurança', descricao: 'Saídas de emergência', critico: true },
  { id: 23, categoria: 'Interior e segurança', descricao: 'Cinto do motorista', critico: true },
  { id: 24, categoria: 'Interior e segurança', descricao: 'Bancos, catraca e limpeza', critico: false },
  { id: 25, categoria: 'Interior e segurança', descricao: 'Ar-condicionado / ventilação', critico: false },
]