const jwt = require('jsonwebtoken');

module.exports = function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Faça login para continuar.' });
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = dados.id;
    req.usuarioNome = dados.nome;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Sessão expirada. Entre novamente.' });
  }
};
