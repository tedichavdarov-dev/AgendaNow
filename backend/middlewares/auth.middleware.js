const jwt = require("jsonwebtoken");

module.exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token no proporcionado!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token inválido o expirado!"
      });
    }

    req.user = payload;
    next();
  });
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acceso denegado! Solo administradores!"
    });
  }
  next();
};