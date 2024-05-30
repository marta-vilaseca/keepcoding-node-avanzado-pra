const Usuario = require("../models/Usuario");

const jwt = require("jsonwebtoken");

class LoginController {
  async postAPIJWT(req, res, next) {
    try {
      const { email, password } = req.body;

      // buscar el usuario en la BD
      const usuario = await Usuario.findOne({ email: email });

      // si no lo encuentro o no coincide la contraseña --> error
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.json({ error: "invalid credentials" });
        return;
      }

      // si lo encuentro y la contraseña está bien --> emitir un JWT
      const tokenJWT = await jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      res.json({ tokenJWT: tokenJWT });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LoginController;
