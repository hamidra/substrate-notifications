// This component will simply add utility functions to your developer console.
import { useSubstrate } from '../';

export default function DeveloperConsole(props) {
  const { keyring, keyringState } = useSubstrate();
  if (keyringState === 'READY') {
    window.keyring = keyring;
  }
  window.util = require('@polkadot/util');
  window.utilCrypto = require('@polkadot/util-crypto');

  return null;
}
