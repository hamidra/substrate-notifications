import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import Login from './pages/login';
import { DeveloperConsole } from './substrate-lib/components';
import { Container, Row, Col } from 'react-bootstrap';
import canary from '../src/assets/Kusama_Canary.svg';
import {
  AuthContextProvider,
  useAuthentication,
} from './authentication/authContext';
import {
  Switch,
  Route,
  matchPath,
  HashRouter as Router,
  Redirect,
  useLocation,
} from 'react-router-dom';
import Subscriptions from './pages/subscriptions';

function SecureRoute({ children, ...props }) {
  let { isAuthenticated } = useAuthentication();
  let location = useLocation();
  // match the current location with current path
  const { params } = matchPath(location.pathname, { ...props });
  let loginPath = params.address ? `/login/${params.address}` : '/login';
  return (
    <Route {...props}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: loginPath,
            state: { from: location },
          }}
        />
      )}
    </Route>
  );
}

function Logo() {
  return (
    <>
      {' '}
      <Container className="mt-3 justify-content-center align-items-center">
        <Row className="justify-content-center align-items-center">
          <Col className="d-flex justify-content-center align-items-center">
            <img alt="kusama canary" height="100" src={canary} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

function Body() {
  const { keyring } = useSubstrate();
  return (
    <>
      <Switch>
        <Route exact path={['/login', '/login/:address']}>
          {keyring && <Login />}
        </Route>
        <SecureRoute exact path={['/management', '/management/:address']}>
          <Subscriptions />
        </SecureRoute>
        <SecureRoute path="/">
          <Redirect to={'/login'} />
        </SecureRoute>
      </Switch>
    </>
  );
}
function App() {
  return (
    <div className="App">
      <SubstrateContextProvider>
        <AuthContextProvider>
          <Logo />
          <Router>
            <Body />
          </Router>
          <DeveloperConsole />
        </AuthContextProvider>
      </SubstrateContextProvider>
    </div>
  );
}

export default App;
