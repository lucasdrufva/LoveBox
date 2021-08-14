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
