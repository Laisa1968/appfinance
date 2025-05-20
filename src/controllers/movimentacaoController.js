const movimentacaoModel = require('../models/movimentacaoModel');
const logger = require('../config/logger');

const movimentacaoController = {
  async createMovimentacao(req, res) {
    const { tipo, valor, data, categoria, descricao } = req.body;
    
    // Verificar se req.user existe
    if (!req.user || !req.user.id) {
      logger.error('Usuário não autenticado', { headers: req.headers });
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const usuario_id = req.user.id;

    // Validação
    if (!tipo || !valor || !data) {
      logger.error('Campos obrigatórios faltando', { 
        body: req.body, 
        user: req.user 
      });
      return res.status(400).json({ error: 'Campos obrigatórios: tipo, valor, data' });
    }
    if (!['entrada', 'saida'].includes(tipo)) {
      logger.error('Tipo inválido', { tipo, user: req.user });
      return res.status(400).json({ error: 'Tipo deve ser "entrada" ou "saida"' });
    }
    if (valor <= 0) {
      logger.error('Valor inválido', { valor, user: req.user });
      return res.status(400).json({ error: 'Valor deve ser positivo' });
    }

    try {
      const movimentacao = await movimentacaoModel.createMovimentacao(
        usuario_id,
        tipo,
        valor,
        data,
        categoria,
        descricao
      );
      logger.info('Movimentação criada com sucesso', { 
        movimentacao_id: movimentacao.id, 
        usuario_id 
      });
      res.status(201).json(movimentacao);
    } catch (error) {
      logger.error('Erro ao criar movimentação', { 
        error: error.message, 
        usuario_id 
      });
      res.status(500).json({ error: error.message });
    }
  },

  async getMovimentacoes(req, res) {
    const { data_inicio, data_fim, tipo, categoria } = req.query;
    if (!req.user || !req.user.id) {
      logger.error('Usuário não autenticado', { headers: req.headers });
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const usuario_id = req.user.id;

    try {
      const movimentacoes = await movimentacaoModel.getMovimentacoes(
        usuario_id,
        data_inicio,
        data_fim,
        tipo,
        categoria
      );
      logger.info('Movimentações listadas', { usuario_id, count: movimentacoes.length });
      res.json(movimentacoes);
    } catch (error) {
      logger.error('Erro ao listar movimentações', { 
        error: error.message, 
        usuario_id 
      });
      res.status(500).json({ error: error.message });
    }
  },

  async getSaldo(req, res) {
    if (!req.user || !req.user.id) {
      logger.error('Usuário não autenticado', { headers: req.headers });
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const usuario_id = req.user.id;

    try {
      const saldo = await movimentacaoModel.getSaldo(usuario_id);
      logger.info('Saldo consultado', { usuario_id, saldo });
      res.json(saldo);
    } catch (error) {
      logger.error('Erro ao consultar saldo', { 
        error: error.message, 
        usuario_id 
      });
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = movimentacaoController;