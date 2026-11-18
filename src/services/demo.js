import { servicosPadrao, funcionamento } from '../data/barbearia';
import { dataISO } from '../utils/formatar';

const ID_DEMO = 'demo';
let contador = 100;

function novoId() {
  contador += 1;
  return `d${contador}`;
}

function proximoDiaAberto() {
  const data = new Date();
  do {
    data.setDate(data.getDate() + 1);
  } while (!funcionamento[data.getDay()].abre);
  return dataISO(data);
}

const amanha = proximoDiaAberto();
let usuario = { id: ID_DEMO, nome: 'Visitante', email: 'visitante@bigode.com', telefone: '' };

const banco = {
  servicos: servicosPadrao.map((s, ordem) => ({ ...s, ordem })),
  produtos: [
    { id: 'p1', nome: 'Pomada Matte Efeito Seco', categoria: 'Pomada', preco: 39.9, estoque: 12, descricao: 'Fixação forte, sem brilho, 120g.' },
    { id: 'p2', nome: 'Pomada Brilho Clássico', categoria: 'Pomada', preco: 34.9, estoque: 3, descricao: 'Penteados retrô com brilho molhado.' },
    { id: 'p3', nome: 'Óleo para Barba Cedro', categoria: 'Óleo', preco: 54, estoque: 8, descricao: 'Hidrata e perfuma, 30ml.' },
    { id: 'p4', nome: 'Shampoo Mentolado 3 em 1', categoria: 'Shampoo', preco: 42, estoque: 0, descricao: 'Cabelo, barba e corpo.' },
    { id: 'p5', nome: 'Balm de Barba Hidratante', categoria: 'Balm', preco: 45, estoque: 6, descricao: 'Amacia os fios e alivia a coceira.' },
    { id: 'p6', nome: 'Cera de Bigode Modeladora', categoria: 'Cera', preco: 29.9, estoque: 15, descricao: 'Para manter o bigode no lugar o dia todo.' },
    { id: 'p7', nome: 'Navalha Clássica Inox', categoria: 'Acessório', preco: 89.9, estoque: 4, descricao: 'Lâmina substituível, cabo de madeira.' },
  ],
  clientes: [
    { id: 'c1', nome: 'João Pedro Silva', telefone: '(11) 98765-4321', email: 'joao@email.com', observacao: 'Degradê na 1, bigode aparado reto.' },
    { id: 'c2', nome: 'Carlos Mendes', telefone: '(11) 97654-3210', email: '', observacao: 'Barba na navalha com toalha quente.' },
    { id: 'c3', nome: 'Rafael Oliveira', telefone: '(11) 96543-2109', email: 'rafa@email.com', observacao: 'Social clássico, risca do lado esquerdo.' },
  ],
  agendamentos: [
    { id: 'a1', data: amanha, hora: '10:00', servico: 'Corte Clássico', servicoId: 'corte-classico', preco: 50, usuario: 'outro', cliente: 'João Pedro' },
    { id: 'a2', data: amanha, hora: '11:30', servico: 'Barba Completa', servicoId: 'barba-completa', preco: 40, usuario: 'outro', cliente: 'Carlos' },
    { id: 'a3', data: amanha, hora: '14:30', servico: 'Corte + Barba', servicoId: 'corte-barba', preco: 80, usuario: 'outro', cliente: 'Rafael' },
    { id: 'a4', data: amanha, hora: '16:00', servico: 'Bigode Desenhado', servicoId: 'bigode-desenhado', preco: 20, usuario: ID_DEMO, cliente: 'Visitante' },
  ],
};

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

function falhar(mensagem) {
  throw new Error(mensagem);
}

function copia(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function porNome(lista) {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
}

function lerBusca(busca) {
  const parametros = {};
  (busca || '').split('&').filter(Boolean).forEach((par) => {
    const [chave, valor = ''] = par.split('=');
    parametros[decodeURIComponent(chave)] = decodeURIComponent(valor);
  });
  return parametros;
}

function crud(colecao, id, metodo, corpo) {
  const lista = banco[colecao];
  if (!id && metodo === 'GET') return porNome(lista);
  if (!id && metodo === 'POST') {
    const novo = { ...corpo, id: novoId() };
    lista.push(novo);
    return novo;
  }
  const indice = lista.findIndex((item) => item.id === id);
  if (indice < 0) falhar('Registro não encontrado.');
  if (metodo === 'PUT') {
    lista[indice] = { ...lista[indice], ...corpo, id };
    return lista[indice];
  }
  if (metodo === 'DELETE') {
    lista.splice(indice, 1);
    return null;
  }
  return lista[indice];
}

export async function respostaDemo(caminho, { metodo = 'GET', corpo = {} } = {}) {
  await esperar(250);
  const [rota, busca] = caminho.split('?');
  const [recurso, id] = rota.split('/').filter(Boolean);

  if (recurso === 'auth') {
    if (id === 'eu') return copia(usuario);
    if (!corpo.email || !corpo.senha) falhar('Preencha e-mail e senha.');
    const nome = corpo.nome || corpo.email.split('@')[0];
    usuario = { id: ID_DEMO, nome, email: corpo.email, telefone: corpo.telefone || '' };
    return { token: 'demo', usuario: copia(usuario) };
  }

  if (recurso === 'servicos') return copia(banco.servicos);

  if (recurso === 'produtos' || recurso === 'clientes') {
    return copia(crud(recurso, id, metodo, corpo));
  }

  if (recurso === 'agendamentos') {
    const lista = banco.agendamentos;
    if (metodo === 'GET' && id === 'meus') {
      return copia(lista.filter((a) => a.usuario === ID_DEMO).sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`)));
    }
    if (metodo === 'GET') {
      const { data } = lerBusca(busca);
      return copia(lista.filter((a) => !data || a.data === data));
    }
    if (metodo === 'POST') {
      if (lista.some((a) => a.data === corpo.data && a.hora === corpo.hora)) {
        falhar('Esse horário acabou de ser reservado por outra pessoa.');
      }
      const servico = banco.servicos.find((s) => s.id === corpo.servicoId);
      if (!servico) falhar('Serviço inválido.');
      const novo = {
        id: novoId(),
        data: corpo.data,
        hora: corpo.hora,
        servico: servico.nome,
        servicoId: servico.id,
        preco: servico.preco,
        usuario: ID_DEMO,
        cliente: usuario.nome,
      };
      lista.push(novo);
      return copia(novo);
    }
    if (metodo === 'DELETE') {
      const indice = lista.findIndex((a) => a.id === id);
      if (indice < 0) falhar('Agendamento não encontrado.');
      if (lista[indice].usuario !== ID_DEMO) falhar('Você só pode cancelar os seus horários.');
      lista.splice(indice, 1);
      return null;
    }
  }

  return falhar('Rota não encontrada.');
}
