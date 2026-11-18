const express = require('express');

module.exports = function crud(Modelo, campos, nomeRegistro) {
  const router = express.Router();

  function filtrar(corpo = {}) {
    const dados = {};
    campos.forEach((campo) => {
      if (corpo[campo] !== undefined) dados[campo] = corpo[campo];
    });
    return dados;
  }

  router.get('/', async (req, res) => {
    const lista = await Modelo.find().collation({ locale: 'pt' }).sort({ nome: 1 });
    res.json(lista);
  });

  router.get('/:id', async (req, res) => {
    const registro = await Modelo.findById(req.params.id);
    if (!registro) return res.status(404).json({ erro: `${nomeRegistro} não encontrado.` });
    res.json(registro);
  });

  router.post('/', async (req, res) => {
    const registro = await Modelo.create(filtrar(req.body));
    res.status(201).json(registro);
  });

  router.put('/:id', async (req, res) => {
    const registro = await Modelo.findById(req.params.id);
    if (!registro) return res.status(404).json({ erro: `${nomeRegistro} não encontrado.` });
    registro.set(filtrar(req.body));
    await registro.save();
    res.json(registro);
  });

  router.delete('/:id', async (req, res) => {
    const registro = await Modelo.findByIdAndDelete(req.params.id);
    if (!registro) return res.status(404).json({ erro: `${nomeRegistro} não encontrado.` });
    res.status(204).end();
  });

  return router;
};
