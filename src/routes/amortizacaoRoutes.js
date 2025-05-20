const express = require('express');
const router = express.Router();
const amortizacaoController = require('../controllers/amortizacaoController');

router.post('/', amortizacaoController.createSimulacao);
router.get('/', amortizacaoController.getSimulacoes);

module.exports = router;