import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useSubstrate } from '../substrate-lib';
import { DownloadSimple } from 'phosphor-react';
import AccountSelector from '../components/AccountSelector';
import CardHeader from '../components/CardHeader';
import { loadExtension } from '../substrate-lib/extension';

const Connecting = () => {
  return (
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
  );
};

const DownloadExtension = () => {
  const extensionLink = 'https://polkadot.js.org/extension/';
  return (
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
  );
};

export default function ExtensionAccount({
  setAccountHandler,
  setAddressHandler,
  title,
  prevStepHandler,
}) {
  const { dispatch, ...state } = useSubstrate();
  const { keyring, extensionState } = state;
  const [selectedAccount, setSelectedAccount] = useState(null);
  const accounts = keyring.getPairs();
  useEffect(() => {
    loadExtension(state, dispatch);
  }, [dispatch, state]);
  const _setAccountHandler = () => {
    setAccountHandler && setAccountHandler(selectedAccount);
    setAddressHandler && setAddressHandler(selectedAccount?.address);
  };

  return (
    <>
      <Container className="justify-content-center align-items-center">
        <Row className="my-2 my-md-5 justify-content-center align-items-center">
          <Col className="my-md-3 d-flex justify-content-center align-items-center">
            <Card
              style={{ width: 580, maxWidth: '100%', minHeight: 300 }}
              className="shadow">
              <Card.Body className="d-flex flex-column">
                <CardHeader
                  title="Login with extension account"
                  cardText="Login with your extension account to manage your notifications"
                />
                {extensionState === 'NOT_AVAILABLE' ? (
                  <DownloadExtension />
                ) : extensionState === 'READY' ? (
                  <>
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
                          onClick={() => _setAccountHandler()}>
                          Connect
                        </button>
                      </Col>
                    </Row>
                  </>
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
