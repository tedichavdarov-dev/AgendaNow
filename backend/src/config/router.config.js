const express = require("express");
const router = express.Router();

const authRouter = require("./auth.router.config");
const espaciosRouter = require("./espacios.router.config");
const reservasRouter = require("./reservas.router.config");

router.use("/api", authRouter);
router.use("/api", espaciosRouter);
router.use("/api", reservasRouter);

module.exports = router;