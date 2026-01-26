import React, { useEffect, useState } from 'react';
import { getReservas, deleteReserva } from '../services/reservasService';

const AdminReservas = () => {
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
    if (window.confirm('Estas seguro de eliminar esta reserva?')) {
      deleteReserva(id)
        .then(() => {
          setSuccess('Reserva eliminada correctamente');
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
      month: 'short'
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
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="display-6 fw-bold mb-1">
                <i className="bi bi-calendar-range me-2"></i>
                Todas las Reservas
              </h1>
              <p className="mb-0 opacity-75">Vista general de todas las reservas del sistema</p>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-light text-dark fs-6">
                <i className="bi bi-list-ul me-1"></i>
                {reservas.length} reservas
              </span>
            </div>
          </div>
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
            <h5>No hay reservas registradas</h5>
            <p className="text-muted">Aun no se han realizado reservas en el sistema.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Usuario</th>
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
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
                          <i className="bi bi-person text-primary"></i>
                        </div>
                        <div>
                          <span className="fw-medium d-block">{reserva.user?.name}</span>
                          <small className="text-muted">{reserva.user?.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                          <i className={`bi ${getTypeIcon(reserva.space?.type)} text-primary small`}></i>
                        </div>
                        <div>
                          <span className="d-block">{reserva.space?.name}</span>
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
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(reserva.id)}
                        title="Eliminar reserva"
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

export default AdminReservas;
