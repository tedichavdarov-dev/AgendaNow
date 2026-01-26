const express = require("express");
const router = express.Router();
const reservaController = require("../../controllers/reserva.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

router.get("/reservas", authenticate, reservaController.getReservas);
router.get("/reservas/:id", authenticate, reservaController.getReservaById);
router.get("/espacios/:spaceId/horarios-ocupados/:date", authenticate, reservaController.getHorariosOcupados);
router.post("/reservas", authenticate, reservaController.createReserva);
router.patch("/reservas/:id", authenticate, reservaController.updateReserva);
router.delete("/reservas/:id", authenticate, reservaController.deleteReserva);

module.exports = router;