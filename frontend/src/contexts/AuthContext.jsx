import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storagedUser = window.localStorage.getItem('user_session');
  const storagedToken = window.localStorage.getItem('token');
  
  const [user, setUser] = useState(storagedUser ? JSON.parse(storagedUser) : null);
  const [token, setToken] = useState(storagedToken || null);

  const handleSetUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    window.localStorage.setItem('user_session', JSON.stringify(userData));
    window.localStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem('user_session');
    window.localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, handleSetUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;