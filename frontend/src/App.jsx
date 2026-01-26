import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import EspacioDetail from './pages/EspacioDetail';
import MisReservas from './pages/MisReservas';
import AdminEspacios from './pages/AdminEspacios';
import AdminReservas from './pages/AdminReservas';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/espacios/:id" 
            element={
              <PrivateRoute>
                <EspacioDetail />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/mis-reservas" 
            element={
              <PrivateRoute>
                <MisReservas />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/admin/espacios" 
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminEspacios />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/admin/reservas" 
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminReservas />
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;