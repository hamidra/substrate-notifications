import logo from './logo.svg';
import './App.css';
import { SubstrateContextProvider } from './substrate-lib';
import Login from './pages/login';
import { useSubstrate } from './substrate-lib';

function Body() {
  const { keyring, ...state } = useSubstrate();
  return keyring && <Login />;
}
function App() {
  return (
    <div className="App">
      <SubstrateContextProvider>
        <Body />
      </SubstrateContextProvider>
    </div>
  );
}

export default App;
