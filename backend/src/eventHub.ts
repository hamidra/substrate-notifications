/**
 * An eventhub to create event streams and let the event consumersChannels subscribe to event queues
 */
import { Pallets } from './chain';

export class EventHub {
  subscribers: Map<string, any[]>;
  constructor() {
    this.subscribers = new Map(
      // add a placeholder for each pallet in Pallets enum
      Object.values(Pallets).map((pallet) => [pallet, []])
    );
  }
  subscribe(pallets: Pallets[], consumerChannel: any) {
    let subscribers = this.subscribers;
    pallets?.forEach(function (pallet) {
      subscribers.has(pallet) && subscribers.get(pallet)?.push(consumerChannel);
    });
  }
  send(events: any) {
    events.forEach((record) => {
      // Extract the phase, event and the event types
      const { event, phase } = record;
      let pallet = event?.section;

      if (this.subscribers.has(pallet)) {
        console.log(
          `${event.section}:${event.method}:${event.data}:${phase.toString()}`
        );
        this.subscribers.get(pallet)?.forEach((subscriber) => {
          subscriber.notify(event);
        });
      }
    });
  }
}
