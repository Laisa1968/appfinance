const pool = require('../config/database');

const amortizacaoModel = {
  async createSimulacao(usuario_id, tipo, valor_emprestimo, taxa_juros, numero_parcelas) {
    if (!['SAC', 'PRICE'].includes(tipo)) throw new Error('Tipo deve ser "SAC" ou "PRICE"');
    if (valor_emprestimo <= 0) throw new Error('Valor do empréstimo deve ser positivo');
    if (taxa_juros <= 0) throw new Error('Taxa de juros deve ser positiva');
    if (numero_parcelas <= 0) throw new Error('Número de parcelas deve ser positivo');

    const taxaMensal = taxa_juros / 100 / 12;
    let parcelas = [];

    if (tipo === 'SAC') {
      const amortizacao = valor_emprestimo / numero_parcelas;
      let saldo = valor_emprestimo;
      for (let i = 1; i <= numero_parcelas; i++) {
        const juros = saldo * taxaMensal;
        const parcela = amortizacao + juros;
        saldo -= amortizacao;
        parcelas.push({
          numero_parcela: i,
          valor_parcela: Number(parcela.toFixed(2)),
          valor_juros: Number(juros.toFixed(2)),
          valor_saldo: Number(saldo.toFixed(2)),
        });
      }
    } else if (tipo === 'PRICE') {
      const parcela = valor_emprestimo * (taxaMensal / (1 - Math.pow(1 + taxaMensal, -numero_parcelas)));
      let saldo = valor_emprestimo;
      for (let i = 1; i <= numero_parcelas; i++) {
        const juros = saldo * taxaMensal;
        const amortizacao = parcela - juros;
        saldo -= amortizacao;
        parcelas.push({
          numero_parcela: i,
          valor_parcela: Number(parcela.toFixed(2)),
          valor_juros: Number(juros.toFixed(2)),
          valor_saldo: Number(saldo.toFixed(2)),
        });
      }
    }

    // Salvar simulação
    const simulacaoQuery = `
      INSERT INTO simulacoes_amortizacao (usuario_id, tipo, valor_emprestimo, taxa_juros, numero_parcelas)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const simulacaoValues = [usuario_id, tipo, valor_emprestimo, taxa_juros, numero_parcelas];
    try {
      const simulacaoResult = await pool.query(simulacaoQuery, simulacaoValues);
      const simulacaoId = simulacaoResult.rows[0].id;

      // Salvar parcelas
      const parcelaQuery = `
        INSERT INTO parcelas_amortizacao (simulacao_id, numero_parcela, valor_parcela, valor_juros, valor_saldo)
        VALUES ($1, $2, $3, $4, $5);
      `;
      for (const parcela of parcelas) {
        await pool.query(parcelaQuery, [
          simulacaoId,
          parcela.numero_parcela,
          parcela.valor_parcela,
          parcela.valor_juros,
          parcela.valor_saldo,
        ]);
      }

      return {
        simulacao: simulacaoResult.rows[0],
        parcelas,
        grafico: {
          labels: parcelas.map(p => `Parcela ${p.numero_parcela}`),
          datasets: [
            {
              label: 'Saldo Devedor',
              data: parcelas.map(p => p.valor_saldo),
              backgroundColor: '#36A2EB',
            },
          ],
        },
      };
    } catch (error) {
      throw new Error(`Erro ao criar simulação de amortização: ${error.message}`);
    }
  },

  async getSimulacoes(usuario_id) {
    const query = `
      SELECT s.*, (
        SELECT json_agg(
          json_build_object(
            'numero_parcela', p.numero_parcela,
            'valor_parcela', p.valor_parcela,
            'valor_juros', p.valor_juros,
            'valor_saldo', p.valor_saldo
          )
        )
        FROM parcelas_amortizacao p
        WHERE p.simulacao_id = s.id
      ) AS parcelas
      FROM simulacoes_amortizacao s
      WHERE s.usuario_id = $1
      ORDER BY s.id DESC;
    `;
    try {
      const result = await pool.query(query, [usuario_id]);
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao listar simulações: ${error.message}`);
    }
  },
};

module.exports = amortizacaoModel;