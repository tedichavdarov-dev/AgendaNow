import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);

    if (userInfo.password !== userInfo.confirmPassword) {
      setError('Las contraseñas no coinciden!');
      return;
    }

    const userData = {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password
    };

    registerUser(userData)
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al registrar usuario');
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Registro</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  Usuario registrado correctamente! Redirigiendo al login...
                </div>
              )}
              
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
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
                    minLength="8"
                    required
                  />
                  <small className="form-text text-muted">Mínimo 8 caracteres</small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={userInfo.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  Registrarse
                </button>
              </form>
              
              <div className="text-center mt-3">
                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;