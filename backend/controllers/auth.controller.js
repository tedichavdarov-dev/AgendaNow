const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = {
    name,
    email,
    password,
    role: role || "USER"
  };

  UserModel.create(newUser)
    .then((user) => {
      res.status(201).json({
        message: "Usuario registrado correctamente!",
        user: user
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(400).json({
          message: "El email ya está registrado!"
        });
      } else {
        res.status(400).json(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email y contraseña son requeridos!"
    });
  }

  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Credenciales inválidas!"
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Credenciales inválidas!"
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Login exitoso!",
        token: token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error en el servidor!",
        error: error
      });
    });
};