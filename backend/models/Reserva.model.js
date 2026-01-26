const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es requerido!"]
    },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Espacio",
      required: [true, "El espacio es requerido!"]
    },
    date: {
      type: Date,
      required: [true, "La fecha es requerida!"]
    },
    startHour: {
      type: String,
      required: [true, "La hora de inicio es requerida!"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido! Use HH:MM"]
    },
    endHour: {
      type: String,
      required: [true, "La hora de fin es requerida!"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido! Use HH:MM"]
    },
    status: {
      type: String,
      enum: ["PENDIENTE", "CONFIRMADA", "CANCELADA"],
      default: "CONFIRMADA"
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model("Reserva", reservaSchema);