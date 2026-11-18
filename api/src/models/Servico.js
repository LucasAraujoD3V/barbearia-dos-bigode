const mongoose = require('mongoose');
const opcoes = require('./opcoes');

const ServicoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true, default: '' },
    preco: { type: Number, required: true, min: 0 },
    duracao: { type: Number, required: true, min: 1 },
    icone: { type: String, default: 'content-cut' },
    ordem: { type: Number, default: 0 },
  },
  { ...opcoes }
);

module.exports = mongoose.model('Servico', ServicoSchema);
