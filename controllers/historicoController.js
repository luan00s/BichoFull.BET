const db = require("../database/connection");

exports.listarHistorico = (req, res) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ erro: "Usuário não autenticado" });
  }

  const sql = `
    SELECT
      a.id,
      a.tipo_aposta,
      a.valor,
      a.animal,
      a.dezena,
      a.milhar,
      a.status,
      a.resultado,
      a.valor_ganho,
      a.criado_em,
      s.id         AS sorteio_id,
      s.premio_1,
      s.premio_2,
      s.premio_3,
      s.premio_4,
      s.premio_5,
      s.criado_em  AS sorteio_data
    FROM apostas a
    LEFT JOIN sorteios s ON a.sorteio_id = s.id
    WHERE a.user_id = ?
    ORDER BY a.id DESC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao buscar histórico" });
    }

    return res.json(result);
  });
};
