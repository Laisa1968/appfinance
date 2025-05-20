const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/authRoutes');
const movimentacoesRoutes = require('./routes/movimentacoesRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');
const jurosCompostosRoutes = require('./routes/jurosCompostosRoutes');
const amortizacaoRoutes = require('./routes/amortizacaoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/calculadora/juros-compostos', jurosCompostosRoutes);
app.use('/api/calculadora/amortizacao', amortizacaoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Servidor rodando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});