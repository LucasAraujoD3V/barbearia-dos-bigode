const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();

function gerarToken(usuario) {
  return jwt.sign({ id: String(usuario._id), nome: usuario.nome }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

router.post('/cadastro', async (req, res) => {
  const { nome, telefone, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
  }
  if (String(senha).length < 6) {
    return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const emailLimpo = String(email).toLowerCase().trim();
  if (await Usuario.exists({ email: emailLimpo })) {
    return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
  }

  const usuario = await Usuario.create({
    nome: String(nome),
    telefone: String(telefone || ''),
    email: emailLimpo,
    senha: await bcrypt.hash(String(senha), 10),
  });

  res.status(201).json({ token: gerarToken(usuario), usuario });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
  }

  const usuario = await Usuario.findOne({ email: String(email).toLowerCase().trim() }).select('+senha');
  const senhaConfere = usuario && (await bcrypt.compare(String(senha), usuario.senha));

  if (!senhaConfere) {
    return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  }

  res.json({ token: gerarToken(usuario), usuario });
});

router.get('/eu', autenticar, async (req, res) => {
  const usuario = await Usuario.findById(req.usuarioId);
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado.' });
  }
  res.json(usuario);
});

module.exports = router;
