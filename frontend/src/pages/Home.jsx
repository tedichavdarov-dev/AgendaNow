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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Espacios Disponibles</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={filtroTipo} 
            onChange={handleFiltroChange}
          >
            <option value="">Todos los tipos</option>
            <option value="SALA">Salas</option>
            <option value="PISTA">Pistas</option>
            <option value="MESA">Mesas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {espacios.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">
                No hay espacios disponibles.
              </div>
            </div>
          ) : (
            espacios.map((espacio) => (
              <div key={espacio.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{espacio.name}</h5>
                    <p className="card-text">
                      <strong>Tipo:</strong> {espacio.type}<br />
                      <strong>Capacidad:</strong> {espacio.capacity} personas<br />
                      <strong>Estado:</strong> {espacio.active ? 
                        <span className="badge bg-success">Activo</span> : 
                        <span className="badge bg-danger">Inactivo</span>
                      }
                    </p>
                    {user && espacio.active && (
                      <Link 
                        to={`/espacios/${espacio.id}`} 
                        className="btn btn-primary"
                      >
                        Ver Detalles y Reservar
                      </Link>
                    )}
                    {!user && (
                      <Link 
                        to="/login" 
                        className="btn btn-secondary"
                      >
                        Inicia sesión para reservar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;