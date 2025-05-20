const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authController = {
  async register(req, res) {
    const { nome, nome_negocio, moeda, idioma, tema_visual, email, senha } = req.body;

    try {
      const usuario = await usuarioModel.createUsuario(
        nome,
        nome_negocio,
        moeda,
        idioma,
        tema_visual,
        email,
        senha
      );
      logger.info('Usuário registrado', { usuario_id: usuario.id, email });
      res.status(201).json({ message: 'Usuário criado com sucesso', usuario });
    } catch (error) {
      logger.error('Erro ao registrar usuário', { error: error.message, email });
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      logger.error('Campos obrigatórios faltando no login', { body: req.body });
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
      const usuario = await usuarioModel.findUsuarioByEmail(email);
      if (!usuario) {
        logger.error('Usuário não encontrado', { email });
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isMatch = await bcrypt.compare(senha, usuario.senha);
      if (!isMatch) {
        logger.error('Senha incorreta', { email });
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const secret = process.env.JWT_SECRET || 'sua_chave_secreta';
      logger.info('Gerando token com JWT_SECRET', { secretLength: secret.length });
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        secret,
        { expiresIn: '1d' }
      );

      logger.info('Login bem-sucedido', { usuario_id: usuario.id, email });
      res.json({
        message: 'Login bem-sucedido',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      });
    } catch (error) {
      logger.error('Erro ao fazer login', { error: error.message, email });
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;