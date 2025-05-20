const pool = require('../config/database');

const movimentacaoModel = {
  // Criar uma nova movimentação (RF01, RF02)
  async createMovimentacao(usuario_id, tipo, valor, data, categoria, descricao) {
    const query = `
      INSERT INTO movimentacoes (usuario_id, tipo, valor, data, categoria, descricao)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [usuario_id, tipo, valor, data, categoria, descricao];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao criar movimentação: ${error.message}`);
    }
  },

  // Listar movimentações com filtros (RF06)
  async getMovimentacoes(usuario_id, filtros = {}) {
    let query = `SELECT * FROM movimentacoes WHERE usuario_id = $1`;
    const values = [usuario_id];
    let paramIndex = 2;

    if (filtros.data_inicio) {
      query += ` AND data >= $${paramIndex}`;
      values.push(filtros.data_inicio);
      paramIndex++;
    }
    if (filtros.data_fim) {
      query += ` AND data <= $${paramIndex}`;
      values.push(filtros.data_fim);
      paramIndex++;
    }
    if (filtros.tipo) {
      query += ` AND tipo = $${paramIndex}`;
      values.push(filtros.tipo);
      paramIndex++;
    }
    if (filtros.categoria) {
      query += ` AND categoria = $${paramIndex}`;
      values.push(filtros.categoria);
    }

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar movimentações: ${error.message}`);
    }
  },

  // Obter saldo atual (RF04)
  async getSaldo(usuario_id) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS saldo
      FROM movimentacoes
      WHERE usuario_id = $1;
    `;
    try {
      const result = await pool.query(query, [usuario_id]);
      return result.rows[0].saldo;
    } catch (error) {
      throw new Error(`Erro ao calcular saldo: ${error.message}`);
    }
  },
};

module.exports = movimentacaoModel;