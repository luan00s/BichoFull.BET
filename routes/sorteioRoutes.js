const express = require("express");
const router  = express.Router();

const { simularSorteio, listarSorteios } = require("../controllers/sorteioController");
const { verificarToken, verificarAdmin }  = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Sorteio
 *   description: Motor de sorteio — acesso restrito ao admin (RF07)
 */

/**
 * @swagger
 * /sorteio/simular:
 *   post:
 *     summary: Dispara um sorteio e processa todas as apostas pendentes (RF07)
 *     description: >
 *       Gera 5 prêmios de milhar aleatórios. Todas as apostas com status **pendente**
 *       são verificadas contra o 1º prêmio e marcadas como processadas.
 *       Taxas: Grupo 18x | Dezena 60x | Milhar 4000x.
 *       **Somente administradores podem acessar este endpoint.**
 *     tags: [Sorteio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sorteio realizado com sucesso
 *       403:
 *         description: Acesso restrito a administradores
 *       401:
 *         description: Não autenticado
 */
router.post("/sorteio/simular", verificarToken, verificarAdmin, simularSorteio);

/**
 * @swagger
 * /sorteio:
 *   get:
 *     summary: Lista os últimos 20 sorteios realizados
 *     tags: [Sorteio]
 *     responses:
 *       200:
 *         description: Lista de sorteios
 */
router.get("/sorteio", listarSorteios);

module.exports = router;
