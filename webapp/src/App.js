import logo from './logo.svg';
import './App.css';

import {AuthProvider} from './AuthProvider';
import Navigation from './Navigation';
import {DeviceProvider} from './DeviceContext';

function App() {
  return (
    <div className="App">
      <AuthProvider auth={null}>
        <DeviceProvider device={null}>
          <Navigation />
        </DeviceProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
