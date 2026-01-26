import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEspacioById } from '../services/espaciosService';
import { createReserva } from '../services/reservasService';

const EspacioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [espacio, setEspacio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [reservaData, setReservaData] = useState({
    date: '',
    startHour: '',
    endHour: ''
  });

  useEffect(() => {
    getEspacioById(id)
      .then((response) => {
        setEspacio(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar espacio:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservaData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const reserva = {
      space: id,
      date: reservaData.date,
      startHour: reservaData.startHour,
      endHour: reservaData.endHour
    };

    createReserva(reserva)
      .then(() => {
        setSuccess(true);
        setReservaData({ date: '', startHour: '', endHour: '' });
        setTimeout(() => {
          navigate('/mis-reservas');
        }, 2000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al crear la reserva');
      });
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

  if (!espacio) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Espacio no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">{espacio.name}</h2>
              <p className="card-text">
                <strong>Tipo:</strong> {espacio.type}<br />
                <strong>Capacidad:</strong> {espacio.capacity} personas<br />
                <strong>Estado:</strong> {espacio.active ? 
                  <span className="badge bg-success">Activo</span> : 
                  <span className="badge bg-danger">Inactivo</span>
                }
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Crear Reserva</h3>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  Reserva creada correctamente! Redirigiendo...
                </div>
              )}

              {!espacio.active ? (
                <div className="alert alert-warning">
                  Este espacio no está activo y no se puede reservar.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={reservaData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="startHour" className="form-label">Hora de inicio (HH:MM)</label>
                    <input
                      type="time"
                      className="form-control"
                      id="startHour"
                      name="startHour"
                      value={reservaData.startHour}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="endHour" className="form-label">Hora de fin (HH:MM)</label>
                    <input
                      type="time"
                      className="form-control"
                      id="endHour"
                      name="endHour"
                      value={reservaData.endHour}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Crear Reserva
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspacioDetail;