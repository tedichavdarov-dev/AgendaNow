require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conexion a MongoDB exitosa!");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

const authRouter = require("./src/config/auth.router.config");
const espaciosRouter = require("./src/config/espacios.router.config");
const reservasRouter = require("./src/config/reservas.router.config");

app.use("/api", authRouter);
app.use("/api", espaciosRouter);
app.use("/api", reservasRouter);

app.get("/", (req, res) => {
  res.json({ message: "AgendaNow backend funcionando correctamente" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
