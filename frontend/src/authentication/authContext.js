import React, { useReducer, useContext, useMemo } from 'react';
import { verify_w3token } from './web3Auth';

const AuthContext = React.createContext();

const INIT_STATE = {
  address: null,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADDRESS':
      let address = action.payload || '';
      let isAuthenticated = address ? isAddressAuthenticated(address) : false;
      return { ...state, address, isAuthenticated };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const getW3tokenCookie = (address) => {
  let w3token = document.cookie
    ?.split('; ')
    ?.find((row) => row.startsWith(`w3token_${address}=`))
    ?.split('=')[1];

  return w3token ? decodeURIComponent(w3token) : null;
};

const deleteW3tokenCookie = (address) => {
  document.cookie = `w3token_${address}=;expires=${new Date(
    Date.now() - 60 * 60 * 1000
  ).toUTCString()}`;
};

const isAddressAuthenticated = (address) => {
  let w3token = getW3tokenCookie(address);
  if (w3token) {
    return true;
  } else {
    // no w3token found in cookies
    console.log(`no w3token was found for the address.`);
    return false;
  }
};

const AuthContextProvider = (props) => {
  // filtering props and merge with default param value
  let address = localStorage.getItem('loginAddress');
  let isAuthenticated = address ? isAddressAuthenticated(address) : false;
  const [state, dispatch] = useReducer(reducer, {
    ...INIT_STATE,
    address,
    isAuthenticated,
  });

  const setAddress = (address) => {
    localStorage.setItem('loginAddress', address);
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  // the context provider will refresh everytime a new object is assigned to it's value,
  // hence we useMemo to only create a new Object when state changes
  const contextValue = useMemo(() => ({ ...state, setAddress }), [state]);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuthentication = () => ({ ...useContext(AuthContext) });
export { AuthContextProvider, useAuthentication };
