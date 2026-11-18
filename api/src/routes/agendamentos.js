const express = require('express');
const Agendamento = require('../models/Agendamento');
const Servico = require('../models/Servico');

const router = express.Router();

router.get('/', async (req, res) => {
  const filtro = {};
  if (req.query.data) filtro.data = String(req.query.data);
  const lista = await Agendamento.find(filtro).sort({ data: 1, hora: 1 });
  res.json(lista);
});

router.get('/meus', async (req, res) => {
  const lista = await Agendamento.find({ usuario: req.usuarioId }).sort({ data: 1, hora: 1 });
  res.json(lista);
});

router.post('/', async (req, res) => {
  const { data, hora, servicoId } = req.body || {};

  const servico = await Servico.findById(servicoId);
  if (!servico) {
    return res.status(400).json({ erro: 'Serviço inválido.' });
  }

  try {
    const agendamento = await Agendamento.create({
      data: String(data),
      hora: String(hora),
      servico: servico.nome,
      servicoId: servico._id,
      preco: servico.preco,
      usuario: req.usuarioId,
      cliente: req.usuarioNome,
    });
    res.status(201).json(agendamento);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ erro: 'Esse horário acabou de ser reservado por outra pessoa.' });
    }
    throw err;
  }
});

router.delete('/:id', async (req, res) => {
  const agendamento = await Agendamento.findById(req.params.id);
  if (!agendamento) {
    return res.status(404).json({ erro: 'Agendamento não encontrado.' });
  }
  if (String(agendamento.usuario) !== req.usuarioId) {
    return res.status(403).json({ erro: 'Você só pode cancelar os seus horários.' });
  }
  await agendamento.deleteOne();
  res.status(204).end();
});

module.exports = router;
