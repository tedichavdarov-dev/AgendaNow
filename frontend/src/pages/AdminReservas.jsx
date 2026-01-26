import React, { useEffect, useState } from 'react';
import { getReservas, deleteReserva } from '../services/reservasService';

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      deleteReserva(id)
        .then(() => {
          loadReservas();
        })
        .catch((error) => {
          console.error('Error al eliminar reserva:', error);
          alert('Error al eliminar la reserva');
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
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
      <h1 className="mb-4">Todas las Reservas</h1>

      {reservas.length === 0 ? (
        <div className="alert alert-info">
          No hay reservas registradas.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Espacio</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.user?.name}</td>
                  <td>{reserva.user?.email}</td>
                  <td>{reserva.space?.name}</td>
                  <td>{reserva.space?.type}</td>
                  <td>{formatDate(reserva.date)}</td>
                  <td>{reserva.startHour}</td>
                  <td>{reserva.endHour}</td>
                  <td>
                    {reserva.status === 'CONFIRMADA' && (
                      <span className="badge bg-success">Confirmada</span>
                    )}
                    {reserva.status === 'PENDIENTE' && (
                      <span className="badge bg-warning">Pendiente</span>
                    )}
                    {reserva.status === 'CANCELADA' && (
                      <span className="badge bg-danger">Cancelada</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(reserva.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReservas;