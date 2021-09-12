import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useSubstrate } from '../substrate-lib';
import { DownloadSimple } from 'phosphor-react';
import AccountSelector from '../components/AccountSelector';
import CardHeader from '../components/CardHeader';
import { loadExtension } from '../substrate-lib/extension';
import { issue_w3token } from '../authentication/web3Auth';
import { web3FromSource } from '@polkadot/extension-dapp';
import apiClient from '../apiClient';
import ErrorModal from '../components/Error';
import { useHistory } from 'react-router';
import { useAuthentication } from '../authentication/authContext';

const Connecting = () => {
  return (
    <>
      <CardHeader
        title="Login with your account"
        cardText="Connecting to Polkadot Extension to load your account"
      />
      <Row className="p-md-5 justify-content-center">
        <Col className="d-flex flex-column justify-content-center align-items-center text-center">
          <div
            style={{ height: '100px' }}
            className="d-flex flex-column justify-content-around align-items-center">
            <div>
              <Spinner animation="border" role="status">
                <span className="sr-only">Processing...</span>
              </Spinner>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

const DownloadExtension = () => {
  const extensionLink = 'https://polkadot.js.org/extension/';
  return (
    <>
      <CardHeader
        title="Login with your account"
        cardText="No Polkadot extension was detected. Install polkadot extention and add your account to be able to login."
      />
      <Row className="p-md-5 justify-content-center">
        <Col className="d-flex flex-column justify-content-center align-items-center text-center">
          <a
            style={{ height: '100px' }}
            className="d-flex flex-column justify-content-around align-items-center"
            href={extensionLink}
            target="_blank"
            rel="noopener noreferrer">
            <DownloadSimple
              className="flex-shrink-0 p-2 rounded icon"
              size={68}
            />
            <div style={{ fontSize: '1rem' }} className="text-secondary">
              Download Polkadot Extension
            </div>
          </a>
        </Col>
      </Row>
    </>
  );
};

const LoginWithExtension = ({ loginHandler, accounts }) => {
  const history = useHistory();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState(null);
  const [{ signer, canSign }, setSigner] = useState({
    signer: null,
    canSign: false,
  });
  const { setAddress } = useAuthentication();
  const resetPageState = () => {
    setInProgress(false);
    setError(null);
  };
  const _loginHandler = () => {
    if (loginHandler) {
      setInProgress(true);
      let account = selectedAccount;
      loginHandler({ account, signer })
        .then((authResult) => {
          resetPageState();
          if (authResult) {
            // set address
            setAddress(account?.address);
            // go to next page
            history.push('/subscriptions');
          }
        })
        .catch((error) => {
          setError(`${error}`);
          console.log(error);
        });
    }
  };
  useEffect(() => {
    let { source, isInjected, isExternal, isHardware } =
      selectedAccount?.meta || {};
    setSigner({
      signer: null,
      canSign: !(isInjected || isExternal || isHardware),
    });
    if (selectedAccount && source && isInjected) {
      web3FromSource(source)
        .then((injected) =>
          setSigner({
            canSign: !!injected?.signer?.signRaw,
            signer: injected?.signer || null,
          })
        )
        .catch((err) => console.error(err));
    }
  }, [selectedAccount]);
  return (
    <>
      <CardHeader
        title="Login with your account"
        cardText="Login with your web3 extension account to manage your notifications"
      />
      <Row className="p-md-5 justify-content-center">
        <Col className="d-flex flex-column justify-content-center align-items-center text-center">
          <AccountSelector
            accounts={accounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            maxStrlength={15}
          />
        </Col>
      </Row>
      <div className="d-flex flex-grow-1" />
      <Row>
        <Col className="pt-4 d-flex justify-content-center">
          <button
            className="btn btn-primary"
            disabled={!canSign}
            onClick={() => _loginHandler()}>
            {inProgress ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"></span>
                &nbsp; Logging in ...
              </>
            ) : (
              <>Login</>
            )}
          </button>
        </Col>
      </Row>
      <ErrorModal
        show={!!error}
        message={error}
        handleClose={() => resetPageState()}
      />
    </>
  );
};

export default function Web3Login({ loginHandler }) {
  const { dispatch, ...state } = useSubstrate();
  const { keyring, extensionState } = state;

  const accounts = keyring.getPairs();

  const _loginHandler = async (signingAccount) => {
    let { status, nonce } = await apiClient.getNonce(
      signingAccount?.account?.address
    );
    if (nonce) {
      let w3token = await issue_w3token({ nonce, signingAccount });
      let authResult = await apiClient.authenticate(
        w3token,
        signingAccount?.account?.address
      );
      console.log(nonce);
      console.log(w3token);
      console.log(`authenticated:${authResult}`);
      return authResult;
    } else {
      console.log(
        `was not able to get a nonce from server. status code ${status}`
      );
      throw new Error(
        `Not able to authenticate with server. server status: ${status}`
      );
    }
  };

  useEffect(() => {
    loadExtension(state, dispatch);
  }, [dispatch, state]);

  return (
    <>
      <Container className="justify-content-center align-items-center">
        <Row className="my-2 my-md-5 justify-content-center align-items-center">
          <Col className="my-md-3 d-flex justify-content-center align-items-center">
            <Card
              style={{ width: 580, maxWidth: '100%', minHeight: 300 }}
              className="shadow">
              <Card.Body className="d-flex flex-column">
                {extensionState === 'NOT_AVAILABLE' ? (
                  <DownloadExtension />
                ) : extensionState === 'READY' ? (
                  <LoginWithExtension
                    loginHandler={_loginHandler}
                    accounts={accounts}
                  />
                ) : (
                  <Connecting />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
