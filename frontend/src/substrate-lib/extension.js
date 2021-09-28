import config from '../config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

export const loadExtension = async (state, dispatch, chainInfo) => {
  const { keyring } = state;
  // load extension only once, when api and keyring-ui are ready
  if (state.keyringState === 'READY' && !state.extensionState) {
    try {
      dispatch({ type: 'LOAD_EXTENSION' });
      const injectedExt = await web3Enable(config.APP_NAME);
      console.log(injectedExt);
      if (injectedExt.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        dispatch({ type: 'NO_EXTENSION' });
        return;
      }
      const extAccounts = await web3Accounts();

      console.log(extAccounts);
      // toDO: subscribe to extension account updates
      const loadedAddresses = keyring
        .getAccounts()
        .map((account) => account.address);
      const loadedSet = new Set(loadedAddresses);

      // filter the extension accounts that are not already loaded,
      // and either don't have geneisHash(open for all chains)
      // or their genesisHash matches with the current network
      const newAccounts = extAccounts.filter((account) => {
        return (
          !loadedSet.has(account.address) &&
          (!chainInfo?.genesisHash ||
            !account.meta?.genesisHash ||
            account.meta?.genesisHash.toString() === chainInfo?.genesisHash)
        );
      });
      console.log(newAccounts);
      for (const account of newAccounts) {
        const injectedAcct = {
          address: account.address,
          meta: {
            ...account.meta,
            isInjected: true,
          },
          type: account.type,
        };
        const pair = keyring.keyring.addFromAddress(
          injectedAcct.address,
          injectedAcct.meta,
          null,
          injectedAcct.type
        );
        keyring.addPair(pair);
      }
      dispatch({ type: 'SET_EXTENSION' });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'EXTENSION_ERROR' });
    }
  }
};
