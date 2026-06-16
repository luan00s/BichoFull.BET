const jwt = require("jsonwebtoken");

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ erro: "Token mal formado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
};

exports.verificarAdmin = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ erro: "Acesso restrito a administradores" });
  }
  next();
};
