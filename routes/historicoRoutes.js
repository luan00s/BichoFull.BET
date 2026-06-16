const express = require("express");
const router  = express.Router();

const { listarHistorico } = require("../controllers/historicoController");
const { verificarToken }  = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Histórico
 *   description: Histórico de apostas do usuário (RF08)
 */

/**
 * @swagger
 * /historico:
 *   get:
 *     summary: Lista o histórico de apostas do usuário autenticado (RF08)
 *     description: >
 *       Retorna todas as apostas do usuário, pendentes e processadas.
 *       Para apostas processadas, inclui os prêmios do sorteio vinculado,
 *       o resultado (GANHOU/PERDEU) e o valor ganho.
 *     tags: [Histórico]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get("/historico", verificarToken, listarHistorico);

module.exports = router;
