import React, { useEffect, useState } from 'react';
import { getEspacios, createEspacio, updateEspacio, deleteEspacio } from '../services/espaciosService';

const AdminEspacios = () => {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setSuccess(null);

    const espacioData = {
      ...formData,
      capacity: parseInt(formData.capacity)
    };

    const promise = editingId
      ? updateEspacio(editingId, espacioData)
      : createEspacio(espacioData);

    promise
      .then(() => {
        setSuccess(editingId ? 'Espacio actualizado correctamente' : 'Espacio creado correctamente');
        loadEspacios();
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
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
    setError(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Estas seguro de eliminar este espacio?')) {
      deleteEspacio(id)
        .then(() => {
          setSuccess('Espacio eliminado correctamente');
          loadEspacios();
          setTimeout(() => setSuccess(null), 3000);
        })
        .catch((error) => {
          console.error('Error al eliminar espacio:', error);
          setError('Error al eliminar el espacio');
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SALA': return 'bi-door-open';
      case 'PISTA': return 'bi-dribbble';
      case 'MESA': return 'bi-table';
      default: return 'bi-building';
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="container-fluid">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="display-6 fw-bold mb-1">
                <i className="bi bi-building-gear me-2"></i>
                Gestionar Espacios
              </h1>
              <p className="mb-0 opacity-75">Administra los espacios disponibles para reservas</p>
            </div>
            <button
              className="btn btn-light d-flex align-items-center gap-2"
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
            >
              {showForm ? (
                <>
                  <i className="bi bi-x-lg"></i>
                  Cancelar
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg"></i>
                  Nuevo Espacio
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </div>
        )}

        {showForm && (
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <i className={`bi ${editingId ? 'bi-pencil' : 'bi-plus-circle'} text-primary`}></i>
                {editingId ? 'Editar Espacio' : 'Crear Nuevo Espacio'}
              </h5>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      <i className="bi bi-tag me-1"></i>
                      Nombre del espacio
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Ej: Sala de reuniones A"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="type" className="form-label">
                      <i className="bi bi-grid me-1"></i>
                      Tipo
                    </label>
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

                  <div className="col-md-3">
                    <label htmlFor="capacity" className="form-label">
                      <i className="bi bi-people me-1"></i>
                      Capacidad
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="capacity"
                      name="capacity"
                      placeholder="Personas"
                      value={formData.capacity}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="active"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        role="switch"
                      />
                      <label className="form-check-label" htmlFor="active">
                        <i className={`bi ${formData.active ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'} me-1`}></i>
                        {formData.active ? 'Espacio activo (disponible para reservas)' : 'Espacio inactivo'}
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <hr className="my-2" />
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                        <i className={`bi ${editingId ? 'bi-check-lg' : 'bi-plus-lg'}`}></i>
                        {editingId ? 'Guardar cambios' : 'Crear espacio'}
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando espacios...</p>
          </div>
        ) : espacios.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-building"></i>
            <h5>No hay espacios creados</h5>
            <p className="text-muted">Crea el primer espacio para empezar a recibir reservas.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-lg me-2"></i>
              Crear primer espacio
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Espacio</th>
                  <th>Tipo</th>
                  <th className="text-center">Capacidad</th>
                  <th className="text-center">Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {espacios.map((espacio) => (
                  <tr key={espacio.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                          <i className={`bi ${getTypeIcon(espacio.type)} text-primary`}></i>
                        </div>
                        <span className="fw-medium">{espacio.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary">{espacio.type}</span>
                    </td>
                    <td className="text-center">
                      <i className="bi bi-people me-1 text-muted"></i>
                      {espacio.capacity}
                    </td>
                    <td className="text-center">
                      {espacio.active ? (
                        <span className="badge bg-success-subtle text-success">
                          <i className="bi bi-check-circle me-1"></i>Activo
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger">
                          <i className="bi bi-x-circle me-1"></i>Inactivo
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleEdit(espacio)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(espacio.id)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEspacios;
