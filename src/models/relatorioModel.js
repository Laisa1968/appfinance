const pool = require('../config/database');

const relatorioModel = {
  // Resumo mensal (RF07)
  async getResumoMensal(usuario_id, ano, mes) {
    const query = `
      SELECT 
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS total_entradas,
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS total_saidas,
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS saldo
      FROM movimentacoes
      WHERE usuario_id = $1
        AND EXTRACT(YEAR FROM data) = $2
        AND EXTRACT(MONTH FROM data) = $3;
    `;
    try {
      const result = await pool.query(query, [usuario_id, ano, mes]);
      return {
        total_entradas: Number(result.rows[0].total_entradas).toFixed(2),
        total_saidas: Number(result.rows[0].total_saidas).toFixed(2),
        saldo: Number(result.rows[0].saldo).toFixed(2),
      };
    } catch (error) {
      throw new Error(`Erro ao gerar resumo mensal: ${error.message}`);
    }
  },

  // Distribuição por categoria para gráfico de pizza (RF08)
  async getDistribuicaoPorCategoria(usuario_id, ano, mes) {
    const query = `
      SELECT 
        COALESCE(categoria, 'Sem Categoria') AS categoria,
        SUM(valor) AS total,
        tipo
      FROM movimentacoes
      WHERE usuario_id = $1
        AND EXTRACT(YEAR FROM data) = $2
        AND EXTRACT(MONTH FROM data) = $3
      GROUP BY categoria, tipo
      ORDER BY total DESC;
    `;
    try {
      const result = await pool.query(query, [usuario_id, ano, mes]);
      return result.rows.map(row => ({
        categoria: row.categoria,
        tipo: row.tipo,
        total: Number(row.total).toFixed(2),
      }));
    } catch (error) {
      throw new Error(`Erro ao gerar distribuição por categoria: ${error.message}`);
    }
  },

  // Comparativo por mês para gráfico de barras (RF09, RF10)
  async getComparativoMensal(usuario_id, ano) {
    const query = `
      SELECT 
        EXTRACT(MONTH FROM data) AS mes,
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS total_entradas,
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS total_saidas
      FROM movimentacoes
      WHERE usuario_id = $1
        AND EXTRACT(YEAR FROM data) = $2
      GROUP BY EXTRACT(MONTH FROM data)
      ORDER BY mes;
    `;
    try {
      const result = await pool.query(query, [usuario_id, ano]);
      return result.rows.map(row => ({
        mes: Number(row.mes),
        total_entradas: Number(row.total_entradas).toFixed(2),
        total_saidas: Number(row.total_saidas).toFixed(2),
      }));
    } catch (error) {
      throw new Error(`Erro ao gerar comparativo mensal: ${error.message}`);
    }
  },
};

module.exports = relatorioModel;