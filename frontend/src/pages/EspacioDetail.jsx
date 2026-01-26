import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEspacioById } from '../services/espaciosService';
import { createReserva, getHorariosOcupados } from '../services/reservasService';

const EspacioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [espacio, setEspacio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const [reservaData, setReservaData] = useState({
    date: '',
    startHour: '',
    endHour: ''
  });

  const horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

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

  const fetchHorariosOcupados = (date) => {
    if (!date) {
      setHorariosOcupados([]);
      return;
    }
    setLoadingHorarios(true);
    getHorariosOcupados(id, date)
      .then((response) => {
        setHorariosOcupados(response);
        setLoadingHorarios(false);
      })
      .catch((error) => {
        console.error('Error al cargar horarios ocupados:', error);
        setHorariosOcupados([]);
        setLoadingHorarios(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservaData(prev => ({ ...prev, [name]: value }));

    if (name === 'date') {
      fetchHorariosOcupados(value);
      setReservaData(prev => ({ ...prev, startHour: '', endHour: '' }));
    }
  };

  const isHourOccupied = (hour) => {
    const hourMinutes = parseInt(hour.split(':')[0]) * 60 + parseInt(hour.split(':')[1]);

    for (let ocupado of horariosOcupados) {
      const startMinutes = parseInt(ocupado.startHour.split(':')[0]) * 60 + parseInt(ocupado.startHour.split(':')[1]);
      const endMinutes = parseInt(ocupado.endHour.split(':')[0]) * 60 + parseInt(ocupado.endHour.split(':')[1]);

      if (hourMinutes >= startMinutes && hourMinutes < endMinutes) {
        return true;
      }
    }
    return false;
  };

  const getAvailableStartHours = () => {
    return horasDisponibles.filter(hour => !isHourOccupied(hour));
  };

  const getAvailableEndHours = () => {
    if (!reservaData.startHour) return [];

    const startMinutes = parseInt(reservaData.startHour.split(':')[0]) * 60;
    const availableEndHours = [];

    for (let hour of horasDisponibles) {
      const hourMinutes = parseInt(hour.split(':')[0]) * 60;
      if (hourMinutes <= startMinutes) continue;

      let isValid = true;
      for (let ocupado of horariosOcupados) {
        const ocupadoStart = parseInt(ocupado.startHour.split(':')[0]) * 60;
        const ocupadoEnd = parseInt(ocupado.endHour.split(':')[0]) * 60;

        if (ocupadoStart > startMinutes && ocupadoStart < hourMinutes) {
          isValid = false;
          break;
        }
        if (startMinutes < ocupadoEnd && hourMinutes > ocupadoStart) {
          if (!(hourMinutes <= ocupadoStart || startMinutes >= ocupadoEnd)) {
            isValid = false;
            break;
          }
        }
      }

      if (isValid) {
        availableEndHours.push(hour);
      } else {
        break;
      }
    }

    return availableEndHours;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

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
        setHorariosOcupados([]);
        setTimeout(() => {
          navigate('/mis-reservas');
        }, 2000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al crear la reserva');
        setSubmitting(false);
      });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SALA': return 'bi-door-open';
      case 'PISTA': return 'bi-dribbble';
      case 'MESA': return 'bi-table';
      default: return 'bi-building';
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando espacio...</p>
        </div>
      </div>
    );
  }

  if (!espacio) {
    return (
      <div className="container-fluid py-5">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
          <h3 className="mt-3">Espacio no encontrado</h3>
          <p className="text-muted">El espacio que buscas no existe o fue eliminado.</p>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Volver a espacios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="container-fluid">
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white text-opacity-75 text-decoration-none">
                  <i className="bi bi-house me-1"></i>Espacios
                </Link>
              </li>
              <li className="breadcrumb-item text-white active" aria-current="page">
                {espacio.name}
              </li>
            </ol>
          </nav>
          <h1 className="display-6 fw-bold mb-0">
            <i className={`bi ${getTypeIcon(espacio.type)} me-2`}></i>
            {espacio.name}
          </h1>
        </div>
      </div>

      <div className="container-fluid pb-5">
        <div className="row g-4">
          {/* Info del espacio */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className={`bi ${getTypeIcon(espacio.type)} fs-1 text-primary`}></i>
                  </div>
                  <h4 className="mb-1">{espacio.name}</h4>
                  <span className="badge bg-primary">{espacio.type}</span>
                </div>

                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">
                      <i className="bi bi-people me-2"></i>Capacidad
                    </span>
                    <span className="fw-semibold">{espacio.capacity} personas</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      <i className="bi bi-toggle-on me-2"></i>Estado
                    </span>
                    {espacio.active ? (
                      <span className="badge bg-success-subtle text-success">
                        <i className="bi bi-check-circle me-1"></i>Disponible
                      </span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger">
                        <i className="bi bi-x-circle me-1"></i>No disponible
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-plus text-primary"></i>
                  Nueva Reserva
                </h5>
              </div>
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Reserva creada correctamente! Redirigiendo a tus reservas...
                  </div>
                )}

                {!espacio.active ? (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x display-4 text-muted"></i>
                    <h5 className="mt-3">Espacio no disponible</h5>
                    <p className="text-muted">Este espacio no esta activo actualmente y no puede ser reservado.</p>
                    <Link to="/" className="btn btn-outline-primary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Ver otros espacios
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="date" className="form-label">
                        <i className="bi bi-calendar-date me-1"></i>
                        Fecha de la reserva
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        id="date"
                        name="date"
                        value={reservaData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    {/* Horarios ocupados */}
                    {reservaData.date && (
                      <div className="mb-4">
                        <label className="form-label">
                          <i className="bi bi-clock-history me-1"></i>
                          Horarios del dia
                        </label>
                        {loadingHorarios ? (
                          <div className="text-center py-3">
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                              <span className="visually-hidden">Cargando...</span>
                            </div>
                            <span className="ms-2 text-muted">Cargando disponibilidad...</span>
                          </div>
                        ) : (
                          <div className="d-flex flex-wrap gap-2">
                            {horasDisponibles.map((hour) => {
                              const occupied = isHourOccupied(hour);
                              return (
                                <span
                                  key={hour}
                                  className={`badge ${occupied ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}
                                  style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                                >
                                  <i className={`bi ${occupied ? 'bi-x-circle' : 'bi-check-circle'} me-1`}></i>
                                  {hour}
                                </span>
                              );
                            })}
                          </div>
                        )}
                        {horariosOcupados.length > 0 && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <small className="text-muted d-block mb-2">
                              <i className="bi bi-info-circle me-1"></i>
                              Reservas existentes para este dia:
                            </small>
                            {horariosOcupados.map((ocupado, index) => (
                              <span key={index} className="badge bg-danger me-2 mb-1">
                                {ocupado.startHour} - {ocupado.endHour}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="row g-3 mb-4">
                      <div className="col-6">
                        <label htmlFor="startHour" className="form-label">
                          <i className="bi bi-clock me-1"></i>
                          Hora inicio
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="startHour"
                          name="startHour"
                          value={reservaData.startHour}
                          onChange={handleChange}
                          required
                          disabled={!reservaData.date || loadingHorarios}
                        >
                          <option value="">Seleccionar hora</option>
                          {getAvailableStartHours().map((hour) => (
                            <option key={hour} value={hour}>{hour}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <label htmlFor="endHour" className="form-label">
                          <i className="bi bi-clock-fill me-1"></i>
                          Hora fin
                        </label>
                        <select
                          className="form-select form-select-lg"
                          id="endHour"
                          name="endHour"
                          value={reservaData.endHour}
                          onChange={handleChange}
                          required
                          disabled={!reservaData.startHour || loadingHorarios}
                        >
                          <option value="">Seleccionar hora</option>
                          {getAvailableEndHours().map((hour) => (
                            <option key={hour} value={hour}>{hour}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                      disabled={submitting || success || !reservaData.date || !reservaData.startHour || !reservaData.endHour}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Creando reserva...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-calendar-check"></i>
                          Confirmar Reserva
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspacioDetail;
