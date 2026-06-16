const db      = require("../database/connection");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");
const validator = require("validator");

exports.register = (req, res) => {
  const { nome, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ erro: "E-mail inválido" });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres" });
  }

  db.query("SELECT id FROM usuarios WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });

    if (result.length > 0) {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }

    try {
      const senhaHash = await bcrypt.hash(senha, 10);

      db.query(
        "INSERT INTO usuarios (nome, email, senha, saldo) VALUES (?, ?, ?, 1000.00)",
        [nome, email.toLowerCase(), senhaHash],
        (errInsert) => {
          if (err) return res.status(500).json({ erro: "Erro no servidor", detalhe: err.message });
          return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso" });
        }
      );
    } catch {
      return res.status(500).json({ erro: "Erro ao processar cadastro" });
    }
  });
};

// RF02 — Login via JWT
exports.login = (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  db.query(
    "SELECT id, nome, email, senha, saldo, is_admin FROM usuarios WHERE email = ?",
    [email.toLowerCase()],
    async (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro no servidor" });

      if (result.length === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      try {
        const usuario = result[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
          return res.status(401).json({ erro: "Senha incorreta" });
        }

        const token = jwt.sign(
          { id: usuario.id, email: usuario.email, is_admin: Boolean(usuario.is_admin) },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.json({
          mensagem: "Login realizado com sucesso",
          token,
          usuario: {
            id:       usuario.id,
            nome:     usuario.nome,
            email:    usuario.email,
            saldo:    Number(usuario.saldo),
            is_admin: Boolean(usuario.is_admin),
          },
        });
      } catch {
        return res.status(500).json({ erro: "Erro ao fazer login" });
      }
    }
  );
};
