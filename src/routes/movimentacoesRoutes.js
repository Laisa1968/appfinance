const express = require('express');
const router = express.Router();
const movimentacaoController = require('../controllers/movimentacaoController');

router.post('/', movimentacaoController.createMovimentacao);
router.get('/', movimentacaoController.getMovimentacoes);
router.get('/saldo', movimentacaoController.getSaldo);

module.exports = router;