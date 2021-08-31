import logo from './logo.svg';
import './App.css';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import Login from './pages/login';
import { DeveloperConsole } from './substrate-lib/components';

function Body() {
  const { keyring, ...state } = useSubstrate();
  return keyring && <Login />;
}
function App() {
  return (
    <div className="App">
      <SubstrateContextProvider>
        <Body />
        <DeveloperConsole />
      </SubstrateContextProvider>
    </div>
  );
}

export default App;
