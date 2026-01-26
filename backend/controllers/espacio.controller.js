const EspacioModel = require("../models/Espacio.model");

module.exports.getEspacios = (req, res, next) => {
  const { type } = req.query;
  
  const filter = {};
  if (type) {
    filter.type = type;
  }

  EspacioModel.find(filter)
    .then((espacios) => {
      res.status(200).json(espacios);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error al obtener los espacios!",
        error: error
      });
    });
};

module.exports.getEspacioById = (req, res, next) => {
  const { id } = req.params;

  EspacioModel.findById(id)
    .then((espacio) => {
      if (!espacio) {
        return res.status(404).json({
          message: "Espacio no encontrado!"
        });
      }
      res.status(200).json(espacio);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error al obtener el espacio!",
        error: error
      });
    });
};

module.exports.createEspacio = (req, res, next) => {
  const { name, type, capacity, active } = req.body;

  const newEspacio = {
    name,
    type,
    capacity,
    active: active !== undefined ? active : true
  };

  EspacioModel.create(newEspacio)
    .then((espacio) => {
      res.status(201).json({
        message: "Espacio creado correctamente!",
        espacio: espacio
      });
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

module.exports.updateEspacio = (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  EspacioModel.findByIdAndUpdate(id, updates, { 
    new: true, 
    runValidators: true 
  })
    .then((espacio) => {
      if (!espacio) {
        return res.status(404).json({
          message: "Espacio no encontrado!"
        });
      }
      res.status(200).json({
        message: "Espacio actualizado correctamente!",
        espacio: espacio
      });
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

module.exports.deleteEspacio = (req, res, next) => {
  const { id } = req.params;

  EspacioModel.findByIdAndDelete(id)
    .then((espacio) => {
      if (!espacio) {
        return res.status(404).json({
          message: "Espacio no encontrado!"
        });
      }
      res.status(200).json({
        message: "Espacio eliminado correctamente!"
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error al eliminar el espacio!",
        error: error
      });
    });
};