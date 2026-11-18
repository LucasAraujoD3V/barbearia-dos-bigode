const mongoose = require('mongoose');
const opcoes = require('./opcoes');

const ProdutoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: [true, 'Informe o nome do produto.'], trim: true },
    categoria: { type: String, required: [true, 'Informe a categoria.'], trim: true },
    preco: { type: Number, required: [true, 'Informe o preço.'], min: [0, 'Preço inválido.'] },
    estoque: { type: Number, default: 0, min: [0, 'Estoque inválido.'] },
    descricao: { type: String, trim: true, default: '' },
  },
  { ...opcoes }
);

module.exports = mongoose.model('Produto', ProdutoSchema);
