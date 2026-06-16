const express = require("express");
const router  = express.Router();

const { register, login } = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Cadastro e login de usuários
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cadastra um novo usuário (RF01 / RF03)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso (saldo inicial R$ 1.000,00)
 *       400:
 *         description: Dados inválidos ou e-mail mal formatado
 *       409:
 *         description: E-mail já cadastrado
 */
router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT (RF02)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso — retorna token JWT
 *       401:
 *         description: Senha incorreta
 *       404:
 *         description: Usuário não encontrado
 */
router.post("/login", login);

module.exports = router;
