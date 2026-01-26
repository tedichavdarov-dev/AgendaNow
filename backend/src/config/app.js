require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
require("./config/db.config");
app.use(express.json());

const router = require("./config/router.config");
app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});