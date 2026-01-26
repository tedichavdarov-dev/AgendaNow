const express = require("express");
const router = express.Router();
const espacioController = require("../../controllers/espacio.controller");
const { authenticate, isAdmin } = require("../../middlewares/auth.middleware");

router.get("/espacios", espacioController.getEspacios);
router.get("/espacios/:id", espacioController.getEspacioById);
router.post("/espacios", authenticate, isAdmin, espacioController.createEspacio);
router.patch("/espacios/:id", authenticate, isAdmin, espacioController.updateEspacio);
router.delete("/espacios/:id", authenticate, isAdmin, espacioController.deleteEspacio);

module.exports = router;