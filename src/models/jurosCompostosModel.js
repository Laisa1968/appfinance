const pool = require('../config/database');

const jurosCompostosModel = {
  // Calcular e salvar simulação de juros compostos
  async createSimulacao(usuario_id, valor_inicial, aporte_mensal, taxa_juros, tempo_meses) {
    // Validações
    if (valor_inicial <= 0) throw new Error('Valor inicial deve ser positivo');
    if (taxa_juros <= 0) throw new Error('Taxa de juros deve ser positiva');
    if (tempo_meses <= 0) throw new Error('Tempo deve ser positivo');
    if (aporte_mensal && aporte_mensal < 0) throw new Error('Aporte mensal não pode ser negativo');

    // Calcular juros compostos
    const taxaMensal = taxa_juros / 100 / 12; // Taxa anual para mensal
    let montante = valor_inicial * Math.pow(1 + taxaMensal, tempo_meses);
    if (aporte_mensal) {
      montante += aporte_mensal * ((Math.pow(1 + taxaMensal, tempo_meses) - 1) / taxaMensal);
    }
    montante = Number(montante.toFixed(2)); // Arredondar para 2 casas decimais

    // Gerar dados para gráfico (montante por mês)
    const dadosGrafico = [];
    let montanteAtual = valor_inicial;
    for (let mes = 0; mes <= tempo_meses; mes++) {
      if (mes > 0) {
        montanteAtual = montanteAtual * (1 + taxaMensal);
        if (aporte_mensal) {
          montanteAtual += aporte_mensal;
        }
      }
      dadosGrafico.push({
        mes,
        montante: Number(montanteAtual.toFixed(2)),
      });
    }

    // Salvar no banco
    const query = `
      INSERT INTO simulacoes_juros (usuario_id, valor_inicial, aporte_mensal, taxa_juros, tempo_meses, montante_final)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [usuario_id, valor_inicial, aporte_mensal, taxa_juros, tempo_meses, montante];
    try {
      const result = await pool.query(query, values);
      return {
        simulacao: result.rows[0],
        grafico: dadosGrafico,
      };
    } catch (error) {
      throw new Error(`Erro ao criar simulação: ${error.message}`);
    }
  },

  // Listar simulações de um usuário
  async getSimulacoes(usuario_id) {
    const query = `
      SELECT * FROM simulacoes_juros WHERE usuario_id = $1 ORDER BY id DESC;
    `;
    try {
      const result = await pool.query(query, [usuario_id]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar simulações: ${error.message}`);
    }
  },
};

module.exports = jurosCompostosModel;