const express = require('express');
const router = express.Router();
const jurosCompostosController = require('../controllers/jurosCompostosController');

router.post('/', jurosCompostosController.createSimulacao);
router.get('/', jurosCompostosController.getSimulacoes);

module.exports = router;