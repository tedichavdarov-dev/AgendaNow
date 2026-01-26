import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <i className="bi bi-calendar-check me-2 fs-4"></i>
          AgendaNow
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-1" to="/">
                <i className="bi bi-building"></i>
                <span>Espacios</span>
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center gap-1" to="/mis-reservas">
                  <i className="bi bi-bookmark-check"></i>
                  <span>Mis Reservas</span>
                </NavLink>
              </li>
            )}
            {user && user.role === 'ADMIN' && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-gear"></i>
                  <span>Administracion</span>
                </a>
                <ul className="dropdown-menu dropdown-menu">
                  <li>
                    <NavLink className="dropdown-item d-flex align-items-center gap-2" to="/admin/espacios">
                      <i className="bi bi-building-gear"></i>
                      Gestionar Espacios
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item d-flex align-items-center gap-2" to="/admin/reservas">
                      <i className="bi bi-calendar-range"></i>
                      Todas las Reservas
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center">
            {!user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center gap-1" to="/login">
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Iniciar Sesion</span>
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink className="btn btn-light btn-sm px-3 d-flex align-items-center gap-1" to="/register">
                    <i className="bi bi-person-plus"></i>
                    <span>Registrarse</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <span className="d-none d-lg-inline">{user.name}</span>
                  {user.role === 'ADMIN' && (
                    <span className="badge bg-light text-primary ms-1">Admin</span>
                  )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="px-3 py-2 text-muted small">
                    <i className="bi bi-envelope me-2"></i>
                    {user.email}
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={onLogout}>
                      <i className="bi bi-box-arrow-right"></i>
                      Cerrar Sesion
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
