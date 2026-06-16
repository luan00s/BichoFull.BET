const mysql = require("mysql2");

const db = mysql.createConnection({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "jogo_bicho",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err.message);
    process.exit(1);
  }
  console.log("Conectado ao MySQL");
});

module.exports = db;
