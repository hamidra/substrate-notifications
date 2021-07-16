/**
 * A chain watcher to subscribe to chain events.
 */

// Import the API
import { ApiPromise, WsProvider } from '@polkadot/api';
import { u8aToString } from '@polkadot/util';

const chainUrl = 'wss://rpc.polkadot.io';

export class Api {
  static api: any;
  static async getApi() {
    if (!this.api) {
      const wsProvider = new WsProvider(chainUrl);
      this.api = await ApiPromise.create({ provider: wsProvider });
    }
    return this.api;
  }
}

export class Council {
  members: Map<String, any> = new Map();
  async loadMembers() {
    const api = await Api.getApi();
    let _members: Map<string, any> = new Map();
    let addresses = (await api.query.council.members()).toHuman();
    for (let address of addresses) {
      let identity = (await api.query.identity.identityOf(address)).toHuman();
      console.log(identity);
      let info: Record<string, any> = {};
      info.display = identity?.info?.display?.Raw;
      info.legal = identity?.info?.legal?.Raw;
      info.email = identity?.info?.email?.Raw;
      _members.set(address, info);
    }
    this.members = _members;
  }
}

export class Watcher {
  async start(eventHub: any) {
    const api = await Api.getApi();

    // Subscribe to system events via storage
    api.query.system.events((events) => {
      console.log(`\nReceived ${events.length} events:`);
      eventHub.send(events);
    });
  }
}
