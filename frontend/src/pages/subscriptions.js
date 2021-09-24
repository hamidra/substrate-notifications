import { Container, Row, Form, Col, Button } from 'react-bootstrap';
import { useAuthentication } from '../authentication/authContext';
import { useEffect, useState } from 'react';
import apiClient from '../apiClient';
import { useHistory } from 'react-router';
import { Formik, Form as FormikForm, FieldArray, Field } from 'formik';
import Pallets from '../pallets';
import { useSubstrate } from '../substrate-lib';
import { stringHelpers } from '../utils';
import { AccountItem } from '../components/AccountSelector';

const authzErrors = [401, 403];

const toCapitalize = (str) => {
  let capitalized = str;
  if (str && typeof str === 'string') {
    capitalized =
      str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
  }
  return capitalized;
};

export default function Subscriptions() {
  let { isAuthenticated, address } = useAuthentication();
  let { keyring } = useSubstrate();
  let account = keyring?.getAccount(address);
  let [pallets, setPallets] = useState(Pallets.curate([]));
  let history = useHistory();

  useEffect(() => {
    apiClient
      .getSubscription(address)
      .then(({ status, data }) => {
        if (status === 200) {
          console.log(data || 'no data');
          let curatedPallets = Pallets.curate(data?.pallets);
          setPallets(curatedPallets || []);
        } else if (authzErrors.includes(status)) {
          // the was an issue with user authnetication
          history.push('login');
        }
      })
      .catch((error) => {
        console.log(`there was an issue fetching user data: ${error}`);
      });

    return () => {
      // add cleanup to cancel pending requests
    };
  }, [isAuthenticated, address, history]);
  const updatePallets = async (pallets) => {
    console.log(pallets);
    let serializedPallets = Pallets.serialize(pallets);
    let { status } = await apiClient.updatePallets(address, serializedPallets);

    if (status === 200) {
      return pallets;
    } else if (authzErrors.includes(status)) {
      // there was an issue with user authnetication
      history.push('login');
    } else {
      throw new Error(`Update failed. Server Status Code: ${status}`);
    }
  };
  return (
    <>
      <Container
        className="justify-content-center align-items-center"
        style={{ width: 600, maxWidth: '100%' }}>
        <Row className="justify-content-center align-items-center text-center">
          <Col className="my-2 d-flex justify-content-center align-items-center">
            <div>
              <h4>Manage your notifications</h4>
              <p>
                Let us know what events you are interested in. We will update
                your preferences.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex my-1 align-items-center justify-content-between">
            <AccountItem account={account || { address }} />
            <button
              className="btn btn-sm border-0"
              onClick={() => history.push('login')}>
              Change Account →
            </button>
          </Col>
          <div className="w-100" />
          <Col>
            <Formik
              enableReinitialize
              initialValues={{ pallets }}
              onSubmit={async (values, actions) => {
                try {
                  let updatedPallets = await updatePallets(values?.pallets);
                  setPallets(updatedPallets);
                  actions.setSubmitting(false);
                  actions.resetForm();
                } catch (error) {
                  console.log(error);
                  actions.setSubmitting(false);
                }
              }}>
              {({ values, submitForm, dirty }) => {
                return (
                  <FormikForm>
                    <FieldArray name="pallets">
                      {({ add }) =>
                        values.pallets?.map((pallet, palletIdx) => (
                          <div
                            className="form-row border border-primary rounded px-4 pt-4 pb-0 mb-3"
                            key={palletIdx}>
                            <div className="col-12">
                              <h4>{toCapitalize(pallet?.name)}</h4>
                            </div>

                            {pallet.events?.map(({ name }, eventIdx) => (
                              <div key={eventIdx} className="col-12">
                                <div className="form-group form-check">
                                  <Field
                                    key={eventIdx}
                                    type="checkbox"
                                    name={`pallets.${palletIdx}.events.${eventIdx}.isSubscribed`}
                                    className="form-check-input"
                                  />
                                  <label className="form-check-label">
                                    {toCapitalize(name)}
                                  </label>
                                  <small className="d-block form-text text-muted">
                                    Get notified when a motion has been
                                    proposed.
                                  </small>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))
                      }
                    </FieldArray>
                    <Row>
                      <Col className="d-flex justify-content-center">
                        <Button
                          style={{ minWidth: '200px' }}
                          onClick={() => submitForm()}
                          disabled={!dirty}>
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </FormikForm>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
}
