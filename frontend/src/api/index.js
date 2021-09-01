import axios from 'axios';

const apiBaseUrl = 'http://localhost:8080';
export const api = {
  getNonce: async (address) => {
    let apiUrl = new URL(`authorize/${address}/nonce`, apiBaseUrl);
    let res = await axios.get(apiUrl.toString());
    if (res?.status < 400) {
      return res?.data?.nonce;
    } else {
      throw new Error(`failed to get nonce from server. status:${res?.status}`);
    }
  },
  authenticate: async (web3token) => {
    let apiUrl = new URL(`authorize/`, apiBaseUrl);
    let headers = { authorization: `bearer ${web3token}` };
    let res = await axios.get(apiUrl.toString(), { headers, withCredentials: true });
    if (res?.status === 200) {
      return true;
    } else {
      return false;
    }
  },
};