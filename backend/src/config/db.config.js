const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conexión a MongoDB exitosa!");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });