import React from 'react';
import {createContext, useState, useContext} from 'react';

const DeviceContext = createContext({code: '123', name: 'No name device'});

export function DeviceProvider({device, children}) {
  const [currentDevice, setCurrentDevice] = useState(device);

  return (
    <DeviceContext.Provider
      value={{device: currentDevice, setDevice: setCurrentDevice}}>
      {children}
    </DeviceContext.Provider>
  );
}

export const useDevice = () => useContext(DeviceContext);
