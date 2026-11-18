const mongoose = require('mongoose');
const opcoes = require('./opcoes');

const ClienteSchema = new mongoose.Schema(
  {
    nome: { type: String, required: [true, 'Informe o nome do cliente.'], trim: true },
    telefone: { type: String, required: [true, 'Informe o telefone.'], trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    observacao: { type: String, trim: true, default: '' },
  },
  { ...opcoes }
);

module.exports = mongoose.model('Cliente', ClienteSchema);
