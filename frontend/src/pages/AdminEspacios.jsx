import React, { useEffect, useState } from 'react';
import { getEspacios, createEspacio, updateEspacio, deleteEspacio } from '../services/espaciosService';

const AdminEspacios = () => {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'SALA',
    capacity: '',
    active: true
  });

  useEffect(() => {
    loadEspacios();
  }, []);

  const loadEspacios = () => {
    setLoading(true);
    getEspacios()
      .then((response) => {
        setEspacios(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar espacios:', error);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const espacioData = {
      ...formData,
      capacity: parseInt(formData.capacity)
    };

    const promise = editingId 
      ? updateEspacio(editingId, espacioData)
      : createEspacio(espacioData);

    promise
      .then(() => {
        loadEspacios();
        resetForm();
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al guardar el espacio');
      });
  };

  const handleEdit = (espacio) => {
    setFormData({
      name: espacio.name,
      type: espacio.type,
      capacity: espacio.capacity,
      active: espacio.active
    });
    setEditingId(espacio.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este espacio?')) {
      deleteEspacio(id)
        .then(() => {
          loadEspacios();
        })
        .catch((error) => {
          console.error('Error al eliminar espacio:', error);
          alert('Error al eliminar el espacio');
        });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'SALA',
      capacity: '',
      active: true
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestionar Espacios</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Crear Nuevo Espacio'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3>{editingId ? 'Editar Espacio' : 'Crear Espacio'}</h3>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="type" className="form-label">Tipo</label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="SALA">Sala</option>
                  <option value="PISTA">Pista</option>
                  <option value="MESA">Mesa</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="capacity" className="form-label">Capacidad</label>
                <input
                  type="number"
                  className="form-control"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="active">
                  Activo
                </label>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {espacios.map((espacio) => (
              <tr key={espacio.id}>
                <td>{espacio.name}</td>
                <td>{espacio.type}</td>
                <td>{espacio.capacity}</td>
                <td>
                  {espacio.active ? 
                    <span className="badge bg-success">Activo</span> : 
                    <span className="badge bg-danger">Inactivo</span>
                  }
                </td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(espacio)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(espacio.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEspacios;