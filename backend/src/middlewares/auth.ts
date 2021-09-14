import { verify_w3token } from '../authentication';
export default async (req, res, next) => {
  let w3tokenName = `w3token_${req?.params?.address || ''}`;
  let w3token = req.cookies[w3tokenName];
  let { error, header, payload } = (await verify_w3token(w3token)) || {
    error: 'was not able to verify the token',
  };
  if (error) {
    console.log(error);
    res.status(401).send();
  } else {
    req.w3token = w3token;
    req.w3address = payload?.address;
    next();
  }
};
