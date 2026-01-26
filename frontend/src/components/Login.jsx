import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { handleSetUser } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    
    loginUser(userInfo)
      .then((response) => {
        handleSetUser(response.user, response.token);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={userInfo.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  Iniciar Sesión
                </button>
              </form>
              
              <div className="text-center mt-3">
                <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;