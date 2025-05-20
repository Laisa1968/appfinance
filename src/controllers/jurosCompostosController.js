const jurosCompostosModel = require('../models/jurosCompostosModel');

const jurosCompostosController = {
  async createSimulacao(req, res) {
    const { usuario_id, valor_inicial, aporte_mensal, taxa_juros, tempo_meses } = req.body;

    // Validações
    if (!usuario_id || !valor_inicial || !taxa_juros || !tempo_meses) {
      return res.status(400).json({ error: 'Campos obrigatórios: usuario_id, valor_inicial, taxa_juros, tempo_meses' });
    }

    try {
      const resultado = await jurosCompostosModel.createSimulacao(
        usuario_id,
        valor_inicial,
        aporte_mensal,
        taxa_juros,
        tempo_meses
      );
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSimulacoes(req, res) {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id é obrigatório' });
    }

    try {
      const simulacoes = await jurosCompostosModel.getSimulacoes(usuario_id);
      res.json(simulacoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = jurosCompostosController;