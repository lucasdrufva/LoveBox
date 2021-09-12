import React from 'react';
import {createContext, useState, useContext} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({auth, children}) {
  const [currentAuth, setCurrentAuth] = useState(auth);

  return (
    <AuthContext.Provider value={{auth: currentAuth, setAuth: setCurrentAuth}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

//http://10.0.2.2:5000
export const baseUrl = 'http://192.168.198.10:5000';
