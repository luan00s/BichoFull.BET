const db = require("../database/connection");

exports.atualizarSaldo = (req, res) => {
  const user_id = req.user?.id;
  const { tipo, valor } = req.body || {};

  if (!user_id) {
    return res.status(401).json({ erro: "Usuário não autenticado" });
  }

  if (!tipo || valor === undefined || valor === null || valor === "") {
    return res.status(400).json({ erro: "Dados incompletos. Informe tipo (deposito | saque) e valor" });
  }

  if (!["deposito", "saque"].includes(tipo)) {
    return res.status(400).json({ erro: "Tipo inválido. Use deposito ou saque" });
  }

  const valorNumerico = Number(valor);
  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    return res.status(400).json({ erro: "Valor inválido. Deve ser um número positivo" });
  }

  db.query("SELECT saldo FROM usuarios WHERE id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar saldo" });

    if (result.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const saldoAtual = Number(result[0].saldo);
    let novoSaldo    = saldoAtual;

    if (tipo === "deposito") {
      novoSaldo = saldoAtual + valorNumerico;
    } else {
      if (saldoAtual < valorNumerico) {
        return res.status(400).json({
          erro: "Saldo insuficiente para saque",
          saldo_atual: saldoAtual,
        });
      }
      novoSaldo = saldoAtual - valorNumerico;
    }

    db.query("UPDATE usuarios SET saldo = ? WHERE id = ?", [novoSaldo, user_id], (errUpdate) => {
      if (errUpdate) return res.status(500).json({ erro: "Erro ao atualizar saldo" });

      return res.json({
        mensagem: `${tipo === "deposito" ? "Depósito" : "Saque"} realizado com sucesso`,
        saldo: novoSaldo,
      });
    });
  });
};

exports.consultarSaldo = (req, res) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ erro: "Usuário não autenticado" });
  }

  db.query("SELECT saldo FROM usuarios WHERE id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar saldo" });

    if (result.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    return res.json({ saldo: Number(result[0].saldo) });
  });
};
