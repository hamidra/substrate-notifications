/**
 * A chain watcher to subscribe to chain events.
 */

// Import the API
import { ApiPromise, WsProvider } from '@polkadot/api';
import { u8aToString } from '@polkadot/util';
import * as config from './config.json';

export enum Pallets {
  COUNCIL = 'council',
  DEMOCRACY = 'democracy',
  BALANCES = 'balances',
}

export class Api {
  static api: any;
  static async getApi() {
    if (!this.api) {
      const wsProvider = new WsProvider(config.PROVIDER_SOCKET);
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
    return api.query.system.events((events) => {
      console.log(`\nReceived ${events.length} events.`);
      // Loop through the Vec<EventRecord>
      let seenSet = new Set();
      events.forEach((record) => {
        // Extract the phase, event and the event types
        const { event, phase } = record;
        const types = event.typeDef;

        //check for dublicates
        if (
          event.section != 'paraInclusion' &&
          event.section != 'staking' &&
          event.section != 'utility'
        ) {
          // Show what we are busy with
          console.log(
            `${event.section}:${event.method}:${event.data}:${phase.toString()}`
          );
          if (
            seenSet.has(
              `${event.section}:${event.method}:${
                event.data
              }:${phase.toString()}`
            )
          ) {
            console.log(
              `duplicate event: ${event.section}:${event.method}:${
                event.data
              }:${phase.toString()}`
            );
            console.log(event.toHuman());
          } else {
            seenSet.add(
              `${event.section}:${event.method}:${
                event.data
              }:${phase.toString()}`
            );
          }
        }
      });
      eventHub.send(events);
    });
  }
}

export class FinalizedWatcher {
  async start(eventHub: any) {
    const api = await Api.getApi();

    // Subscribe to new finalized blocks
    const unsubFinalized = await api.rpc.chain.subscribeFinalizedHeads(
      async (header) => {
        console.log(`finalized #${header.number}:`, header.toHuman());
        // get events at the finalized block
        const events = await api.query.system.events.at(header.hash);
        console.log(`\nReceived ${events.length} events.`);
        events.forEach((record) => {
          // Extract the phase, event and the event types
          const { event, phase } = record;
          const types = event.typeDef;
        });
        eventHub?.send(events);
      }
    );
  }
}

export const parseEvent = (event) => {
  try {
    let parsed = {
      pallet: event?.section,
      method: event?.method,
      params: event?.data,
    };
    return { parsed };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
