import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSetUser } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    loginUser(userInfo)
      .then((response) => {
        handleSetUser(response.user, response.token);
        navigate('/');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Error al iniciar sesion');
        setLoading(false);
      });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5 auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow mb-3" style={{width: '64px', height: '64px'}}>
                  <i className="bi bi-calendar-check fs-3 text-primary"></i>
                </div>
                <h4 className="text-white fw-bold">AgendaNow</h4>
              </Link>
            </div>

            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1">Bienvenido</h2>
                  <p className="text-muted">Inicia sesion para continuar</p>
                </div>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-1"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      placeholder="tu@email.com"
                      value={userInfo.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-1"></i>
                      Contrasena
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      placeholder="Tu contrasena"
                      value={userInfo.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right"></i>
                        Iniciar Sesion
                      </>
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    No tienes cuenta?{' '}
                    <Link to="/register" className="fw-semibold text-decoration-none">
                      Registrate aqui
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <Link to="/" className="text-white text-decoration-none opacity-75">
                <i className="bi bi-arrow-left me-1"></i>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
