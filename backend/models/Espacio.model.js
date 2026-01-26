const mongoose = require("mongoose");

const espacioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del espacio es requerido!"],
      minLength: [3, "El nombre debe tener al menos 3 caracteres!"]
    },
    type: {
      type: String,
      enum: ["SALA", "PISTA", "MESA"],
      required: [true, "El tipo de espacio es requerido!"]
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad es requerida!"],
      min: [1, "La capacidad debe ser al menos 1!"]
    },
    active: {
      type: Boolean,
      default: true
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

module.exports = mongoose.model("Espacio", espacioSchema);