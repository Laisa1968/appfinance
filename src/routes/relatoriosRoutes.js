const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

router.get('/resumo', relatorioController.getResumoMensal);
router.get('/distribuicao', relatorioController.getDistribuicaoPorCategoria);
router.get('/comparativo', relatorioController.getComparativoMensal);

module.exports = router;