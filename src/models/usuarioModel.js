const pool = require('../config/database');
const bcrypt = require('bcrypt');

const usuarioModel = {
  async createUsuario(nome, nome_negocio, moeda, idioma, tema_visual, email, senha) {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error('Email inválido');
    }
    if (senha.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const query = `
      INSERT INTO usuarios (nome, nome_negocio, moeda, idioma, tema_visual, email, senha)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nome, email, moeda, idioma, tema_visual;
    `;
    const values = [nome, nome_negocio || null, moeda || 'BRL', idioma || 'pt', tema_visual || 'claro', email, hashedSenha];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Violação de unicidade (email)
        throw new Error('Email já cadastrado');
      }
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  },

  async findUsuarioByEmail(email) {
    const query = `
      SELECT * FROM usuarios WHERE email = $1;
    `;
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  },
};

module.exports = usuarioModel;