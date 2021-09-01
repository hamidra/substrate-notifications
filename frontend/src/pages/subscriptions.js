import { Container, Row, Form, Col } from 'react-bootstrap';
export default function Subscriptions() {
  return (
    <>
      <Container
        className="justify-content-center align-items-center"
        style={{ width: 600, maxWidth: '100%' }}>
        <Row className="my-2 my-md-5 justify-content-center align-items-center text-center">
          <Col className="my-md-3 d-flex justify-content-center align-items-center">
            <div>
              <h3>Manage your notifications</h3>
              <p>
                Let us know what events you are interested in. We will update
                your preferences.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              {['checkbox', 'radio'].map((type) => (
                <div key={`default-${type}`} className="mb-3">
                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`default ${type}`}
                  />

                  <Form.Check
                    disabled
                    type={type}
                    label={`disabled ${type}`}
                    id={`disabled-default-${type}`}
                  />
                </div>
              ))}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
