import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEspacios } from '../services/espaciosService';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [espacios, setEspacios] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadEspacios();
  }, [filtroTipo]);

  const loadEspacios = () => {
    setLoading(true);
    getEspacios(filtroTipo)
      .then((response) => {
        setEspacios(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar espacios:', error);
        setLoading(false);
      });
  };

  const handleFiltroChange = (e) => {
    setFiltroTipo(e.target.value);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SALA': return 'bi-door-open';
      case 'PISTA': return 'bi-dribbble';
      case 'MESA': return 'bi-table';
      default: return 'bi-building';
    }
  };

  const getTypeBadgeClass = () => {
    return 'bg-primary';
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="page-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold mb-2">
                <i className="bi bi-building me-2"></i>
                Espacios Disponibles
              </h1>
              <p className="lead mb-0 opacity-75">
                Encuentra y reserva el espacio perfecto para tus actividades
              </p>
            </div>
            <div className="col-lg-4 mt-3 mt-lg-0">
              <div className="input-group">
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-funnel text-primary"></i>
                </span>
                <select
                  className="form-select border-0 shadow-sm"
                  value={filtroTipo}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos los tipos</option>
                  <option value="SALA">Salas de reunion</option>
                  <option value="PISTA">Pistas deportivas</option>
                  <option value="MESA">Mesas de coworking</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid pb-5">
        {/* Stats Cards */}
        {!loading && espacios.length > 0 && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center py-3">
                  <i className="bi bi-building fs-4 stat-icon"></i>
                  <h4 className="mb-0 mt-1 stat-value">{espacios.length}</h4>
                  <small className="stat-label">Total Espacios</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center py-3">
                  <i className="bi bi-check-circle fs-4 stat-icon"></i>
                  <h4 className="mb-0 mt-1 stat-value">{espacios.filter(e => e.active).length}</h4>
                  <small className="stat-label">Activos</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center py-3">
                  <i className="bi bi-door-open fs-4 stat-icon"></i>
                  <h4 className="mb-0 mt-1 stat-value">{espacios.filter(e => e.type === 'SALA').length}</h4>
                  <small className="stat-label">Salas</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center py-3">
                  <i className="bi bi-dribbble fs-4 stat-icon"></i>
                  <h4 className="mb-0 mt-1 stat-value">{espacios.filter(e => e.type === 'PISTA').length}</h4>
                  <small className="stat-label">Pistas</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando espacios...</p>
          </div>
        ) : espacios.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <h5>No hay espacios disponibles</h5>
            <p className="text-muted">No se encontraron espacios con los filtros seleccionados.</p>
            {filtroTipo && (
              <button className="btn btn-outline-primary" onClick={() => setFiltroTipo('')}>
                <i className="bi bi-x-circle me-2"></i>
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          /* Spaces Grid */
          <div className="row g-4">
            {espacios.map((espacio) => (
              <div key={espacio.id} className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card space-card h-100 hover-lift">
                  <div className="card-body position-relative">
                    <span className={`badge ${getTypeBadgeClass(espacio.type)} space-type-badge`}>
                      <i className={`bi ${getTypeIcon(espacio.type)} me-1`}></i>
                      {espacio.type}
                    </span>

                    <div className="text-center mb-3 pt-2">
                      <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                           style={{width: '64px', height: '64px'}}>
                        <i className={`bi ${getTypeIcon(espacio.type)} fs-3 text-primary`}></i>
                      </div>
                      <h5 className="card-title mb-1">{espacio.name}</h5>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center text-muted small">
                        <i className="bi bi-people me-1"></i>
                        <span>{espacio.capacity} personas</span>
                      </div>
                      {espacio.active ? (
                        <span className="badge bg-success-subtle text-success">
                          <i className="bi bi-check-circle me-1"></i>Activo
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger">
                          <i className="bi bi-x-circle me-1"></i>Inactivo
                        </span>
                      )}
                    </div>

                    {user && espacio.active ? (
                      <Link
                        to={`/espacios/${espacio.id}`}
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-calendar-plus"></i>
                        Reservar
                      </Link>
                    ) : !user ? (
                      <Link
                        to="/login"
                        className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-box-arrow-in-right"></i>
                        Iniciar sesion
                      </Link>
                    ) : (
                      <button className="btn btn-secondary w-100" disabled>
                        <i className="bi bi-x-circle me-2"></i>
                        No disponible
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
