const db = require("../database/connection");

exports.criarAposta = (req, res) => {
  const user_id = req.user?.id;
  const { animal, tipoAposta, valor, dezena, milhar } = req.body || {};

  if (!user_id) {
    return res.status(401).json({ erro: "Usuário não autenticado" });
  }

  if (!tipoAposta || valor === undefined || valor === null || valor === "") {
    return res.status(400).json({ erro: "Dados incompletos. Informe tipoAposta e valor" });
  }

  const tiposValidos = ["grupo", "dezena", "milhar"];
  if (!tiposValidos.includes(tipoAposta)) {
    return res.status(400).json({ erro: "Tipo de aposta inválido. Use: grupo, dezena ou milhar" });
  }

  const valorNumerico = Number(valor);
  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    return res.status(400).json({ erro: "Valor inválido. Deve ser um número positivo" });
  }

  
  if (tipoAposta === "grupo") {
    const animalNum = Number(animal);
    if (isNaN(animalNum) || animalNum < 1 || animalNum > 25) {
      return res.status(400).json({ erro: "Animal inválido. Informe um número entre 1 e 25" });
    }
  }

  if (tipoAposta === "dezena" && !/^\d{2}$/.test(String(dezena))) {
    return res.status(400).json({ erro: "Dezena inválida. Informe exatamente 2 dígitos (00 a 99)" });
  }

  if (tipoAposta === "milhar" && !/^\d{4}$/.test(String(milhar))) {
    return res.status(400).json({ erro: "Milhar inválida. Informe exatamente 4 dígitos (0000 a 9999)" });
  }

  
  db.beginTransaction((errTx) => {
    if (errTx) return res.status(500).json({ erro: "Erro interno. Tente novamente" });

  
    db.query("SELECT saldo FROM usuarios WHERE id = ? FOR UPDATE", [user_id], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ erro: "Erro ao buscar saldo" }));
      }

      if (result.length === 0) {
        return db.rollback(() => res.status(404).json({ erro: "Usuário não encontrado" }));
      }

      const saldoAtual = Number(result[0].saldo);

      if (saldoAtual < valorNumerico) {
        return db.rollback(() =>
          res.status(400).json({
            erro: "Saldo insuficiente",
            saldo_atual: saldoAtual,
            valor_aposta: valorNumerico,
          })
        );
      }

      const novoSaldo = saldoAtual - valorNumerico;

      db.query(
        "UPDATE usuarios SET saldo = ? WHERE id = ?",
        [novoSaldo, user_id],
        (errUpdate) => {
          if (errUpdate) {
            return db.rollback(() => res.status(500).json({ erro: "Erro ao debitar saldo" }));
          }

          db.query(
            `INSERT INTO apostas (user_id, tipo_aposta, valor, animal, dezena, milhar, status)
             VALUES (?, ?, ?, ?, ?, ?, 'pendente')`,
            [
              user_id,
              tipoAposta,
              valorNumerico,
              tipoAposta === "grupo"  ? Number(animal) : null,
              tipoAposta === "dezena" ? String(dezena) : null,
              tipoAposta === "milhar" ? String(milhar) : null,
            ],
            (errInsert, insertResult) => {
              if (errInsert) {
                return db.rollback(() => res.status(500).json({ erro: "Erro ao registrar aposta" }));
              }

              db.commit((errCommit) => {
                if (errCommit) {
                  return db.rollback(() => res.status(500).json({ erro: "Erro ao confirmar aposta" }));
                }

                return res.status(201).json({
                  mensagem: "Aposta registrada com sucesso. Aguarde o próximo sorteio para ver o resultado.",
                  aposta_id: insertResult.insertId,
                  saldo_restante: novoSaldo,
                });
              });
            }
          );
        }
      );
    });
  });
};
