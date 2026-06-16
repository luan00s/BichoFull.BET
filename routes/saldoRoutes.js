const express = require("express");
const router  = express.Router();

const { atualizarSaldo, consultarSaldo } = require("../controllers/saldoController");
const { verificarToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Saldo
 *   description: Gerenciamento de saldo do usuário
 */

/**
 * @swagger
 * /saldo:
 *   get:
 *     summary: Consulta o saldo atual do usuário autenticado
 *     tags: [Saldo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldo retornado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.get("/saldo", verificarToken, consultarSaldo);

/**
 * @swagger
 * /saldo:
 *   post:
 *     summary: Realiza depósito ou saque (RN3)
 *     tags: [Saldo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo, valor]
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [deposito, saque]
 *                 example: deposito
 *               valor:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Operação realizada com sucesso
 *       400:
 *         description: Saldo insuficiente ou dados inválidos
 *       401:
 *         description: Não autenticado
 */
router.post("/saldo", verificarToken, atualizarSaldo);

module.exports = router;
