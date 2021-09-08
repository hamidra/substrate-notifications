import { verify_w3token } from '../authentication';
export default (req, res, next) => {
  let w3token = req.cookies.w3token;
  let { error, header, payload } = verify_w3token(w3token) || {
    error: 'was not able to verify the token',
  };
  if (error) {
    console.log(error);
    res.status(401).send();
  }
  req.w3token = w3token;
  req.w3address = payload?.address;
  next();
};
