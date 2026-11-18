const Produto = require('../models/Produto');
const crud = require('./crud');

module.exports = crud(Produto, ['nome', 'categoria', 'preco', 'estoque', 'descricao'], 'Produto');
