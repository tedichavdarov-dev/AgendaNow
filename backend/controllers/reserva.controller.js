const ReservaModel = require("../models/Reserva.model");
const EspacioModel = require("../models/Espacio.model");

module.exports.getReservas = (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let filter = {};
  
  if (userRole === "USER") {
    filter.user = userId;
  }

  ReservaModel.find(filter)
    .populate("user", "name email")
    .populate("space", "name type capacity")
    .then((reservas) => {
      res.status(200).json(reservas);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error al obtener las reservas!",
        error: error
      });
    });
};

module.exports.getReservaById = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  ReservaModel.findById(id)
    .populate("user", "name email")
    .populate("space", "name type capacity")
    .then((reserva) => {
      if (!reserva) {
        return res.status(404).json({
          message: "Reserva no encontrada!"
        });
      }

      if (userRole === "USER" && reserva.user._id.toString() !== userId) {
        return res.status(403).json({
          message: "No tienes permiso para ver esta reserva!"
        });
      }

      res.status(200).json(reserva);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error al obtener la reserva!",
        error: error
      });
    });
};

module.exports.createReserva = (req, res, next) => {
  const { space, date, startHour, endHour } = req.body;
  const userId = req.user.id;

  EspacioModel.findById(space)
    .then((espacio) => {
      if (!espacio) {
        return res.status(404).json({
          message: "Espacio no encontrado!"
        });
      }

      if (!espacio.active) {
        return res.status(400).json({
          message: "No se puede reservar un espacio inactivo!"
        });
      }

      const reservaDate = new Date(date);
      reservaDate.setHours(0, 0, 0, 0);

      return ReservaModel.find({
        space: space,
        date: reservaDate,
        status: { $ne: "CANCELADA" }
      });
    })
    .then((reservasExistentes) => {
      const [startH, startM] = startHour.split(":").map(Number);
      const [endH, endM] = endHour.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (startMinutes >= endMinutes) {
        return res.status(400).json({
          message: "La hora de fin debe ser posterior a la hora de inicio!"
        });
      }

      for (let reserva of reservasExistentes) {
        const [existStartH, existStartM] = reserva.startHour.split(":").map(Number);
        const [existEndH, existEndM] = reserva.endHour.split(":").map(Number);
        const existStartMinutes = existStartH * 60 + existStartM;
        const existEndMinutes = existEndH * 60 + existEndM;

        if (
          (startMinutes >= existStartMinutes && startMinutes < existEndMinutes) ||
          (endMinutes > existStartMinutes && endMinutes <= existEndMinutes) ||
          (startMinutes <= existStartMinutes && endMinutes >= existEndMinutes)
        ) {
          return res.status(400).json({
            message: "Ya existe una reserva en ese horario para este espacio!"
          });
        }
      }

      const newReserva = {
        user: userId,
        space,
        date,
        startHour,
        endHour,
        status: "CONFIRMADA"
      };

      return ReservaModel.create(newReserva);
    })
    .then((reserva) => {
      if (!reserva) return;
      
      return ReservaModel.findById(reserva._id)
        .populate("user", "name email")
        .populate("space", "name type capacity");
    })
    .then((reserva) => {
      if (!reserva) return;
      
      res.status(201).json({
        message: "Reserva creada correctamente!",
        reserva: reserva
      });
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

module.exports.updateReserva = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  ReservaModel.findById(id)
    .then((reserva) => {
      if (!reserva) {
        return res.status(404).json({
          message: "Reserva no encontrada!"
        });
      }

      if (userRole === "USER" && reserva.user.toString() !== userId) {
        return res.status(403).json({
          message: "No tienes permiso para modificar esta reserva!"
        });
      }

      return ReservaModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      }).populate("user", "name email").populate("space", "name type capacity");
    })
    .then((reserva) => {
      if (!reserva) return;
      
      res.status(200).json({
        message: "Reserva actualizada correctamente!",
        reserva: reserva
      });
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

module.exports.deleteReserva = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  ReservaModel.findById(id)
    .then((reserva) => {
      if (!reserva) {
        return res.status(404).json({
          message: "Reserva no encontrada!"
        });
      }

      if (userRole === "USER" && reserva.user.toString() !== userId) {
        return res.status(403).json({
          message: "No tienes permiso para eliminar esta reserva!"
        });
      }

      return ReservaModel.findByIdAndDelete(id);
    })
    .then((reserva) => {
      if (!reserva) return;

      res.status(200).json({
        message: "Reserva eliminada correctamente!"
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error al eliminar la reserva!",
        error: error
      });
    });
};

module.exports.getHorariosOcupados = (req, res, next) => {
  const { spaceId, date } = req.params;

  const reservaDate = new Date(date);
  reservaDate.setHours(0, 0, 0, 0);

  ReservaModel.find({
    space: spaceId,
    date: reservaDate,
    status: { $ne: "CANCELADA" }
  })
    .select("startHour endHour")
    .then((reservas) => {
      const horariosOcupados = reservas.map((reserva) => ({
        startHour: reserva.startHour,
        endHour: reserva.endHour
      }));
      res.status(200).json(horariosOcupados);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error al obtener horarios ocupados!",
        error: error
      });
    });
};