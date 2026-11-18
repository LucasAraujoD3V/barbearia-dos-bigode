const express = require('express');
const Servico = require('../models/Servico');

const router = express.Router();

router.get('/', async (req, res) => {
  const lista = await Servico.find().sort({ ordem: 1 });
  res.json(lista);
});

module.exports = router;
