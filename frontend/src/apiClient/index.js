import axios from 'axios';
import config from '../config';

const apiBaseUrl = config.BACKEND_URL;
const apiClient = {
  getNonce: async (address) => {
    if (!address) {
      throw new Error(`No address was provided to issue a token.`);
    }

    // axios
    try {
      let apiUrl = new URL(`authorize/${address}/nonce`, apiBaseUrl);
      let res = await axios.get(apiUrl.toString());
      return { status: res?.status, nonce: res?.data?.nonce };
    } catch (res) {
      return { status: res?.status };
    }
  },

  authenticate: async (web3token, address) => {
    let apiUrl = new URL(`authorize/${address}`, apiBaseUrl);
    let headers = { authorization: `bearer ${web3token}` };
    let res = await axios.get(apiUrl.toString(), {
      headers,
      withCredentials: true,
    });
    if (res?.status === 200) {
      return true;
    } else {
      // return an error to let user now why it was not able to authenticate
      return false;
    }
  },
  getSubscription: async (address) => {
    if (!address) {
      throw new Error(`No address was provided to fetch subscription.`);
    }
    // axios request
    try {
      let apiUrl = new URL(`management/${address}`, apiBaseUrl);
      let response = await axios.get(apiUrl.toString(), {
        withCredentials: true,
      });
      return { status: response?.status, data: response?.data };
    } catch ({ response }) {
      return { status: response?.status };
    }
  },
  updatePallets: async (address, pallets) => {
    if (!address) {
      throw new Error(`No address was provided update subscription.`);
    }
    // axios request
    try {
      let apiUrl = new URL(`management/${address}/pallets`, apiBaseUrl);
      let response = await axios.post(
        apiUrl.toString(),
        { pallets },
        {
          withCredentials: true,
        }
      );
      return { status: response?.status };
    } catch ({ response }) {
      return { status: response?.status };
    }
  },
};

export default apiClient;
