const createError = require("http-errors");
const jwt = require("jsonwebtoken");

// módulo que exporta un middleware
module.exports = (req, res, next) => {
  // sacar el tokenJWT de la cabecera o del body o de la queryString
  const tokenJWT = req.get("Authorization") || req.body.jwt || req.query.jwt;

  // si no tengo un token --> error
  if (!tokenJWT) {
    next(createError(401, "no token provided"));
    return;
  }

  // compruebo que el token es válido
  jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next(createError(401, "invalid token"));
      return;
    }
    // apuntamos el id del usuario logado en la request
    // para que puedan usarlo los siguientes middlewares
    req.apiUserId = payload.userId;
    next();
  });
};
