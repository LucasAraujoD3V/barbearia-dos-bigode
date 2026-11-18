const path = require('path');
require('dotenv').config({
  path: [path.join(__dirname, '..', '.env'), path.join(__dirname, '..', '..', '.env')],
  quiet: true,
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Servico = require('./models/Servico');
const servicosPadrao = require('./servicosPadrao');
const autenticar = require('./middlewares/autenticar');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ api: 'Barbearia dos Bigode', status: 'ok' });
});

app.use('/auth', require('./routes/auth'));
app.use('/produtos', autenticar, require('./routes/produtos'));
app.use('/clientes', autenticar, require('./routes/clientes'));
app.use('/servicos', autenticar, require('./routes/servicos'));
app.use('/agendamentos', autenticar, require('./routes/agendamentos'));

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ erro: 'Registro duplicado.' });
  }
  if (err.name === 'ValidationError') {
    const primeiro = Object.values(err.errors)[0];
    return res.status(400).json({ erro: primeiro ? primeiro.message : 'Dados inválidos.' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ erro: 'Identificador inválido.' });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

const porta = process.env.PORTA || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB conectado');
    if ((await Servico.countDocuments()) === 0) {
      await Servico.insertMany(servicosPadrao);
      console.log('Serviços padrão cadastrados');
    }
    app.listen(porta, '0.0.0.0', () => {
      console.log(`Servidor ligado na porta ${porta}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
