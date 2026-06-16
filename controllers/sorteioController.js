const db = require("../database/connection");
const { gerarCincoPremios, calcularResultado } = require("../services/sorteioService");

exports.simularSorteio = (req, res) => {
  const premios       = gerarCincoPremios();
  const primeiroPremio = premios[0];

  db.beginTransaction((errTx) => {
    if (errTx) return res.status(500).json({ erro: "Erro ao iniciar sorteio" });

    db.query(
      "INSERT INTO sorteios (premio_1, premio_2, premio_3, premio_4, premio_5) VALUES (?, ?, ?, ?, ?)",
      premios,
      (errSorteio, resultSorteio) => {
        if (errSorteio) {
          return db.rollback(() => res.status(500).json({ erro: "Erro ao salvar sorteio" }));
        }

        const sorteioId = resultSorteio.insertId;

        db.query("SELECT * FROM apostas WHERE status = 'pendente'", (errApostas, apostas) => {
          if (errApostas) {
            return db.rollback(() =>
              res.status(500).json({ erro: "Erro ao buscar apostas pendentes" })
            );
          }

          if (apostas.length === 0) {
            return db.commit((errCommit) => {
              if (errCommit) {
                return db.rollback(() => res.status(500).json({ erro: "Erro ao confirmar sorteio" }));
              }
              return res.json({
                mensagem: "Sorteio realizado. Nenhuma aposta pendente.",
                sorteio_id: sorteioId,
                premios,
                primeiro_premio: primeiroPremio,
                total_apostas_processadas: 0,
              });
            });
          }

          processarApostas(apostas, 0, sorteioId, primeiroPremio, (errProcessamento) => {
            if (errProcessamento) {
              return db.rollback(() =>
                res.status(500).json({ erro: "Erro ao processar apostas: " + errProcessamento.message })
              );
            }

            db.commit((errCommit) => {
              if (errCommit) {
                return db.rollback(() => res.status(500).json({ erro: "Erro ao confirmar sorteio" }));
              }

              return res.json({
                mensagem: "Sorteio realizado com sucesso",
                sorteio_id: sorteioId,
                premios,
                primeiro_premio: primeiroPremio,
                total_apostas_processadas: apostas.length,
              });
            });
          });
        });
      }
    );
  });
};


exports.listarSorteios = (req, res) => {
  db.query("SELECT * FROM sorteios ORDER BY id DESC LIMIT 20", (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar sorteios" });
    return res.json(result);
  });
};

function processarApostas(apostas, index, sorteioId, primeiroPremio, callback) {
  if (index >= apostas.length) {
    return callback(null);
  }

  const aposta = apostas[index];
  const { resultado, valorGanho } = calcularResultado(aposta, primeiroPremio);

  db.query(
    `UPDATE apostas
     SET status = 'processada', sorteio_id = ?, resultado = ?, valor_ganho = ?
     WHERE id = ?`,
    [sorteioId, resultado, valorGanho, aposta.id],
    (errAposta) => {
      if (errAposta) return callback(errAposta);

      if (valorGanho > 0) {
  
        db.query(
          "UPDATE usuarios SET saldo = saldo + ? WHERE id = ?",
          [valorGanho, aposta.user_id],
          (errSaldo) => {
            if (errSaldo) return callback(errSaldo);
            processarApostas(apostas, index + 1, sorteioId, primeiroPremio, callback);
          }
        );
      } else {
        processarApostas(apostas, index + 1, sorteioId, primeiroPremio, callback);
      }
    }
  );
}
