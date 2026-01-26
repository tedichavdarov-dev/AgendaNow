const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido!"],
      minLength: [3, "El nombre debe tener al menos 3 caracteres!"]
    },
    email: {
      type: String,
      required: [true, "El email es requerido!"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingrese un email válido!"]
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida!"],
      minLength: [8, "La contraseña debe tener al menos 8 caracteres!"]
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);