const mongoose = require('mongoose');
const opcoes = require('./opcoes');

const AgendamentoSchema = new mongoose.Schema(
  {
    data: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    hora: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    servico: { type: String, required: true },
    servicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Servico' },
    preco: { type: Number, default: 0 },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    cliente: { type: String, default: '' },
  },
  { ...opcoes }
);

AgendamentoSchema.index({ data: 1, hora: 1 }, { unique: true });

module.exports = mongoose.model('Agendamento', AgendamentoSchema);
