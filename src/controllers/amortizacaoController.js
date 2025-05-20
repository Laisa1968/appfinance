const amortizacaoModel = require('../models/amortizacaoModel');

const amortizacaoController = {
  async createSimulacao(req, res) {
    const { usuario_id, tipo, valor_emprestimo, taxa_juros, numero_parcelas } = req.body;

    if (!usuario_id || !tipo || !valor_emprestimo || !taxa_juros || !numero_parcelas) {
      return res.status(400).json({ error: 'Campos obrigatórios: usuario_id, tipo, valor_emprestimo, taxa_juros, numero_parcelas' });
    }

    try {
      const resultado = await amortizacaoModel.createSimulacao(
        usuario_id,
        tipo,
        valor_emprestimo,
        taxa_juros,
        numero_parcelas
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
      const simulacoes = await amortizacaoModel.getSimulacoes(usuario_id);
      res.json(simulacoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = amortizacaoController;