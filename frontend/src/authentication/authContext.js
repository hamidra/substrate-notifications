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
      let address = action.payload;
      let isAuthenticated = isAddressAuthenticated(address);
      return { ...state, address, isAuthenticated };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const w3tokenCookie = (address) => {
  let w3token = document.cookie
    ?.split('; ')
    ?.find((row) => row.startsWith(`w3token_${address}=`))
    ?.split('=')[1];
  return w3token;
};

const deleteW3tokenCookie = (address) => {
  document.cookie = `w3token_${address}=;expires=${new Date(
    Date.now() - 60 * 60 * 1000
  ).toUTCString()}`;
};

const isAddressAuthenticated = (address) => {
  let w3token = w3tokenCookie(address);
  if (w3token) {
    let { error, payload } = verify_w3token(w3token);
    if (error) {
      // w3token is not valid. delete it from cookies
      console.log(`w3token is not valid. error: ${error}`);
      deleteW3tokenCookie(address);
      return false;
    }
    if (payload?.address === address) {
      return true;
    } else {
      // w3token is not valid. delete it from cookies
      console.log(`w3token is not authorized.`);
      return false;
    }
  } else {
    // no w3token found in cookies
    console.log(`no w3token was found for the address.`);
    return false;
  }
};

const AuthContextProvider = (props) => {
  // filtering props and merge with default param value
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const setAddress = (address) => {
    dispatch({ type: 'SET_ADDRESS', payload: address });
  };

  const setAuthStatus = (isAuthenticated) => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: isAuthenticated });
  };

  // the context provider will refresh everytime a new object is assigned to it's value,
  // hence we useMemo to only create a new Object when state changes
  const contextValue = useMemo(
    () => ({ ...state, setAddress, setAuthStatus }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuthentication = () => ({ ...useContext(AuthContext) });
export { AuthContextProvider, useAuthentication };
