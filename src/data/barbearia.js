export const barbearia = {
  nome: 'Barbearia dos Bigode',
  slogan: 'Tradição na navalha desde 1987',
  sobre:
    'Começou com o Seu Bigode, uma cadeira de ferro e uma navalha herdada do avô. Hoje somos três barbeiros, uma geladeira sempre cheia e o mesmo cuidado de sempre: toalha quente, conversa boa e acabamento caprichado.',
  endereco: 'Rua Augusta, 1500 - Consolação',
  cidade: 'São Paulo - SP, 01304-001',
  latitude: -23.5568,
  longitude: -46.6596,
  telefone: '(11) 3000-1987',
  telefoneLink: '+551130001987',
  whatsapp: '5511900001987',
  instagram: 'barbeariadosbigode',
};

export const funcionamento = [
  { dia: 0, nome: 'Domingo', abre: null, fecha: null },
  { dia: 1, nome: 'Segunda', abre: '09:00', fecha: '20:00' },
  { dia: 2, nome: 'Terça', abre: '09:00', fecha: '20:00' },
  { dia: 3, nome: 'Quarta', abre: '09:00', fecha: '20:00' },
  { dia: 4, nome: 'Quinta', abre: '09:00', fecha: '20:00' },
  { dia: 5, nome: 'Sexta', abre: '09:00', fecha: '21:00' },
  { dia: 6, nome: 'Sábado', abre: '08:00', fecha: '18:00' },
];

export const intervaloMinutos = 30;

export const equipe = [
  { nome: 'Seu Bigode', funcao: 'Fundador e mestre da navalha', desde: 1987 },
  { nome: 'Rafa Navalha', funcao: 'Barbas e toalha quente', desde: 2012 },
  { nome: 'Dudu Degradê', funcao: 'Cortes modernos e pigmentação', desde: 2019 },
];

export const diferenciais = [
  { icone: 'glass-mug-variant', texto: 'Cerveja gelada' },
  { icone: 'coffee', texto: 'Café passado na hora' },
  { icone: 'wifi', texto: 'Wi-Fi liberado' },
  { icone: 'television', texto: 'Futebol no telão' },
];

export const servicosPadrao = [
  {
    id: 'corte-classico',
    nome: 'Corte Clássico',
    descricao: 'Tesoura e máquina com acabamento na navalha.',
    preco: 50,
    duracao: 45,
    icone: 'content-cut',
  },
  {
    id: 'barba-completa',
    nome: 'Barba Completa',
    descricao: 'Toalha quente, navalha e balm hidratante.',
    preco: 40,
    duracao: 30,
    icone: 'razor-double-edge',
  },
  {
    id: 'bigode-desenhado',
    nome: 'Bigode Desenhado',
    descricao: 'Modelagem do bigode com cera de fixação.',
    preco: 20,
    duracao: 15,
    icone: 'mustache',
  },
  {
    id: 'corte-barba',
    nome: 'Corte + Barba',
    descricao: 'O combo da casa, com cerveja inclusa.',
    preco: 80,
    duracao: 75,
    icone: 'account-tie',
  },
  {
    id: 'pigmentacao',
    nome: 'Pigmentação',
    descricao: 'Disfarça falhas na barba e no cabelo.',
    preco: 35,
    duracao: 30,
    icone: 'brush',
  },
  {
    id: 'sobrancelha',
    nome: 'Sobrancelha',
    descricao: 'Limpeza e alinhamento na navalha.',
    preco: 15,
    duracao: 10,
    icone: 'eye-outline',
  },
  {
    id: 'hidratacao',
    nome: 'Hidratação',
    descricao: 'Tratamento para cabelo e barba ressecados.',
    preco: 30,
    duracao: 20,
    icone: 'water-outline',
  },
];

export const categoriasProduto = [
  { nome: 'Pomada', icone: 'lotion-outline' },
  { nome: 'Óleo', icone: 'bottle-tonic-outline' },
  { nome: 'Shampoo', icone: 'bottle-tonic' },
  { nome: 'Balm', icone: 'lotion' },
  { nome: 'Cera', icone: 'spa' },
  { nome: 'Acessório', icone: 'razor-single-edge' },
];

export function iconeCategoria(nome) {
  const categoria = categoriasProduto.find((c) => c.nome === nome);
  return categoria ? categoria.icone : 'package-variant-closed';
}
