import { verify_w3token } from './web3Auth';
export const authenticate = (req, address) => {
  let authorization = req.headers['authorization'];
  let [authType, w3token, ...rest] = authorization?.split(' ') || [];
  if (rest.length != 0 || authType.toLowerCase() != 'bearer' || !w3token) {
    return { status: 401 };
  }
  let { error, header, payload } = verify_w3token(w3token) || {
    error: 'was not able to verify the token',
  };
  if (error) {
    console.log(error);
    return { status: 401 };
  }
  if (payload?.address !== address) {
    return { status: 403 };
  }
  return { status: 200, w3token, claims: payload };
};

export * from './web3Auth';
