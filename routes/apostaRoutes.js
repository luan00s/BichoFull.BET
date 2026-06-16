const express = require("express");
const router  = express.Router();

const { criarAposta }   = require("../controllers/apostaController");
const { verificarToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Apostas
 *   description: Registro de apostas
 */

/**
 * @swagger
 * /aposta:
 *   post:
 *     summary: Registra uma aposta (RF05 / RF06)
 *     description: >
 *       A aposta é registrada com status **pendente** e o valor é debitado do saldo
 *       imediatamente. O resultado (GANHOU/PERDEU) só é calculado quando o admin
 *       disparar o sorteio via `POST /sorteio/simular`.
 *     tags: [Apostas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipoAposta, valor]
 *             properties:
 *               tipoAposta:
 *                 type: string
 *                 enum: [grupo, dezena, milhar]
 *                 example: grupo
 *               valor:
 *                 type: number
 *                 example: 50
 *               animal:
 *                 type: integer
 *                 description: Obrigatório quando tipoAposta = "grupo" (1 a 25)
 *                 example: 5
 *               dezena:
 *                 type: string
 *                 description: Obrigatório quando tipoAposta = "dezena" (00 a 99)
 *                 example: "17"
 *               milhar:
 *                 type: string
 *                 description: Obrigatório quando tipoAposta = "milhar" (0000 a 9999)
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: Aposta registrada com sucesso (pendente)
 *       400:
 *         description: Dados inválidos ou saldo insuficiente
 *       401:
 *         description: Não autenticado
 */
router.post("/aposta", verificarToken, criarAposta);

module.exports = router;
