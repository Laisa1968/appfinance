const relatorioModel = require('../models/relatorioModel');

const relatorioController = {
  async getResumoMensal(req, res) {
    const { usuario_id, ano, mes } = req.query;

    // Validações
    if (!usuario_id || !ano || !mes) {
      return res.status(400).json({ error: 'usuario_id, ano e mes são obrigatórios' });
    }
    if (!Number.isInteger(Number(ano)) || !Number.isInteger(Number(mes))) {
      return res.status(400).json({ error: 'ano e mes devem ser números inteiros' });
    }
    if (mes < 1 || mes > 12) {
      return res.status(400).json({ error: 'mes deve estar entre 1 e 12' });
    }

    try {
      const resumo = await relatorioModel.getResumoMensal(usuario_id, ano, mes);
      res.json(resumo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getDistribuicaoPorCategoria(req, res) {
    const { usuario_id, ano, mes } = req.query;

    if (!usuario_id || !ano || !mes) {
      return res.status(400).json({ error: 'usuario_id, ano e mes são obrigatórios' });
    }
    if (!Number.isInteger(Number(ano)) || !Number.isInteger(Number(mes))) {
      return res.status(400).json({ error: 'ano e mes devem ser números inteiros' });
    }
    if (mes < 1 || mes > 12) {
      return res.status(400).json({ error: 'mes deve estar entre 1 e 12' });
    }

    try {
      const distribuicao = await relatorioModel.getDistribuicaoPorCategoria(usuario_id, ano, mes);
      // Formatar para gráfico de pizza
      const grafico = {
        labels: distribuicao.map(item => `${item.categoria} (${item.tipo})`),
        datasets: [{
          data: distribuicao.map(item => item.total),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#C9CBCF', '#E7E9ED', '#7CB342', '#D81B60'
          ],
        }],
      };
      res.json({ dados: distribuicao, grafico });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getComparativoMensal(req, res) {
    const { usuario_id, ano } = req.query;

    if (!usuario_id || !ano) {
      return res.status(400).json({ error: 'usuario_id e ano são obrigatórios' });
    }
    if (!Number.isInteger(Number(ano))) {
      return res.status(400).json({ error: 'ano deve ser um número inteiro' });
    }

    try {
      const comparativo = await relatorioModel.getComparativoMensal(usuario_id, ano);
      // Formatar para gráfico de barras
      const grafico = {
        labels: comparativo.map(item => `Mês ${item.mes}`),
        datasets: [
          {
            label: 'Entradas',
            data: comparativo.map(item => item.total_entradas),
            backgroundColor: '#36A2EB',
          },
          {
            label: 'Saídas',
            data: comparativo.map(item => item.total_saidas),
            backgroundColor: '#FF6384',
          },
        ],
      };
      res.json({ dados: comparativo, grafico });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = relatorioController;