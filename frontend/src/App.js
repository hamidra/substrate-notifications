import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import Login from './pages/login';
import { DeveloperConsole } from './substrate-lib/components';
import { AuthContextProvider } from './authentication/authContext';
import {
  Switch,
  Route,
  HashRouter as Router,
  Redirect,
} from 'react-router-dom';
import Subscriptions from './pages/subscriptions';

function Body() {
  const { keyring } = useSubstrate();
  return (
    <>
      <Switch>
        <Route path="/login">{keyring && <Login />}</Route>
        <AuthContextProvider>
          <Route path="/manage">
            <Subscriptions />
          </Route>
          <Route path="/">
            <Redirect to={'/manage'} />
          </Route>
        </AuthContextProvider>
      </Switch>
    </>
  );
}
function App() {
  return (
    <div className="App">
      <SubstrateContextProvider>
        <Router>
          <Body />
        </Router>
        <DeveloperConsole />
      </SubstrateContextProvider>
    </div>
  );
}

export default App;
