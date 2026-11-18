const mongoose = require('mongoose');
const opcoes = require('./opcoes');

const UsuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: [true, 'Informe o nome.'], trim: true },
    telefone: { type: String, trim: true, default: '' },
    email: {
      type: String,
      required: [true, 'Informe o e-mail.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'E-mail inválido.'],
    },
    senha: { type: String, required: true, select: false },
  },
  {
    ...opcoes,
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.senha;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Usuario', UsuarioSchema);
