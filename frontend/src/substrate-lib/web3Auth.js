import { signatureVerify } from '@polkadot/util-crypto';

const u8aToBase64 = (bytes) => {
  var binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
};
const base64ToU8 = (b64string) => {
  var data = atob(b64string);
  var arr = [];
  for (let i = 0; i < data.length; i++) {
    arr.push(data.charCodeAt(i));
  }
  return new Uint8Array(arr);
};
const signToken = (jwt, signingPair) => {
  if (!signingPair) {
    throw new Error(
      'no signing pair was provided to sign the authentication token.'
    );
  }
  let signature = signingPair.sign(jwt);
  console.log(signature);
  let signature_base64 = u8aToBase64(signature);
  console.log(base64ToU8(signature_base64));
  return `${jwt}.${signature_base64}`;
};

export const issue_w3token = ({ nonce, pair }) => {
  const header = JSON.stringify({
    alg: 'sr25519',
    typ: 'WEB3_JWT',
  });
  const payload = JSON.stringify({
    nonce,
    address: pair?.address,
  });
  let signedToken = signToken(`${btoa(header)}.${btoa(payload)}`, pair);
  return signedToken;
};

export const verify_w3token = (w3token) => {
  let [b64_header, b64_payload, b64_signature] = w3token.split('.');
  let payload = JSON.parse(atob(b64_payload));
  let address = payload?.address;
  let signature = base64ToU8(b64_signature);
  let { isValid } = signatureVerify(
    `${b64_header}.${b64_payload}`,
    signature,
    address
  );
  return isValid;
};
