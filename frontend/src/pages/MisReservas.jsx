import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReservas, deleteReserva } from '../services/reservasService';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = () => {
    setLoading(true);
    getReservas()
      .then((response) => {
        setReservas(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar reservas:', error);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Estas seguro de cancelar esta reserva?')) {
      deleteReserva(id)
        .then(() => {
          setSuccess('Reserva cancelada correctamente');
          loadReservas();
          setTimeout(() => setSuccess(null), 3000);
        })
        .catch((error) => {
          console.error('Error al eliminar reserva:', error);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMADA':
        return <span className="badge bg-success-subtle text-success"><i className="bi bi-check-circle me-1"></i>Confirmada</span>;
      case 'PENDIENTE':
        return <span className="badge bg-warning-subtle text-warning"><i className="bi bi-clock me-1"></i>Pendiente</span>;
      case 'CANCELADA':
        return <span className="badge bg-danger-subtle text-danger"><i className="bi bi-x-circle me-1"></i>Cancelada</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
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
          <h1 className="display-6 fw-bold mb-1">
            <i className="bi bi-bookmark-check me-2"></i>
            Mis Reservas
          </h1>
          <p className="mb-0 opacity-75">Gestiona tus reservas de espacios</p>
        </div>
      </div>

      <div className="container-fluid pb-5">
        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <h5>No tienes reservas</h5>
            <p className="text-muted">Explora los espacios disponibles y haz tu primera reserva.</p>
            <Link to="/" className="btn btn-primary">
              <i className="bi bi-building me-2"></i>
              Ver espacios
            </Link>
          </div>
        ) : (
          <>
            {/* Vista movil: Cards */}
            <div className="d-md-none">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                          <i className={`bi ${getTypeIcon(reserva.space?.type)} text-primary`}></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">{reserva.space?.name}</h6>
                          <small className="text-muted">{reserva.space?.type}</small>
                        </div>
                      </div>
                      {getStatusBadge(reserva.status)}
                    </div>
                    <div className="d-flex gap-3 mb-3 text-muted small">
                      <span><i className="bi bi-calendar me-1"></i>{formatDate(reserva.date)}</span>
                      <span><i className="bi bi-clock me-1"></i>{reserva.startHour} - {reserva.endHour}</span>
                    </div>
                    {reserva.status !== 'CANCELADA' && (
                      <button
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={() => handleDelete(reserva.id)}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Cancelar reserva
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Vista desktop: Tabla */}
            <div className="d-none d-md-block table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Espacio</th>
                    <th>Fecha</th>
                    <th className="text-center">Horario</th>
                    <th className="text-center">Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                            <i className={`bi ${getTypeIcon(reserva.space?.type)} text-primary`}></i>
                          </div>
                          <div>
                            <span className="fw-medium">{reserva.space?.name}</span>
                            <br />
                            <small className="text-muted">{reserva.space?.type}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <i className="bi bi-calendar me-1 text-muted"></i>
                        {formatDate(reserva.date)}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-clock me-1"></i>
                          {reserva.startHour} - {reserva.endHour}
                        </span>
                      </td>
                      <td className="text-center">
                        {getStatusBadge(reserva.status)}
                      </td>
                      <td className="text-end">
                        {reserva.status !== 'CANCELADA' && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(reserva.id)}
                            title="Cancelar reserva"
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MisReservas;
