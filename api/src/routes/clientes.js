const Cliente = require('../models/Cliente');
const crud = require('./crud');

module.exports = crud(Cliente, ['nome', 'telefone', 'email', 'observacao'], 'Cliente');
