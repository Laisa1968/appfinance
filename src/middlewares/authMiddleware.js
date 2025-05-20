const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.error('Token não fornecido', { headers: req.headers });
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    logger.error('Token malformado', { headers: req.headers });
    return res.status(401).json({ error: 'Token malformado' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sua_chave_secreta';
    logger.info('Validando token com JWT_SECRET', { secretLength: secret.length });
    const decoded = jwt.verify(token, secret);
    logger.info('Token validado com sucesso', { 
      user_id: decoded.id, 
      email: decoded.email, 
      iat: new Date(decoded.iat * 1000).toISOString(), 
      exp: new Date(decoded.exp * 1000).toISOString() 
    });
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Falha na validação do token', { 
      error: error.message, 
      tokenSnippet: token.substring(0, 20) + '...' 
    });
    return res.status(401).json({ error: `Token inválido: ${error.message}` });
  }
};

module.exports = authMiddleware;