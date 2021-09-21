import React, { useReducer, useContext, useMemo } from 'react';
import keyring from '@polkadot/ui-keyring';
import config from '../config';
import { loadExtension } from './extension';
///
// Initial state for `useReducer`

const INIT_STATE = {
  keyring: null,
  keyringState: null,
  extensionState: null,
};

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' };
    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' };
    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' };
    case 'LOAD_EXTENSION':
      return { ...state, extensionState: 'LOADING' };
    case 'NO_EXTENSION':
      return { ...state, extensionState: 'NOT_AVAILABLE' };
    case 'EXTENSION_ERROR':
      return { ...state, extensionState: 'ERROR' };
    case 'SET_EXTENSION':
      return { ...state, extensionState: 'READY' };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

///
// Loading accounts from dev and polkadot-js extension
let loadedKeyring = false;
const loadKeyring = (state, dispatch) => {
  const asyncLoadAccounts = async () => {
    dispatch({ type: 'LOAD_KEYRING' });
    try {
      keyring.loadAll({
        genesisHash: state.chainInfo?.genesisHash,
        isDevelopment: config.DEVELOPMENT_KEYRING,
        ss58Format: state.chainInfo?.ss58Format,
      });
      dispatch({ type: 'SET_KEYRING', payload: keyring });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'KEYRING_ERROR' });
    }
  };
  const { keyringState } = state;
  // If `keyringState` is not null `asyncLoadAccounts` is running.
  if (keyringState) return;
  // If `loadedKeyring` is true, the `asyncLoadAccounts` has been run once.
  if (loadedKeyring) return dispatch({ type: 'SET_KEYRING', payload: keyring });

  // This is the heavy duty work
  loadedKeyring = true;
  asyncLoadAccounts();
};

const SubstrateContext = React.createContext();

const SubstrateContextProvider = (props) => {
  // filtering props and merge with default param value
  const initState = { ...INIT_STATE };

  const [state, dispatch] = useReducer(reducer, initState);

  // load keyring
  loadKeyring(state, dispatch);

  // load extension
  loadExtension(state, dispatch);

  console.log(state);

  // the context provider will refresh everytime a new object is assigned to it's value,
  // hence we useMemo to only create a new Object when state changes
  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );
  return (
    <SubstrateContext.Provider value={contextValue}>
      {props.children}
    </SubstrateContext.Provider>
  );
};

const useSubstrate = () => ({ ...useContext(SubstrateContext) });

export { SubstrateContextProvider, useSubstrate };
