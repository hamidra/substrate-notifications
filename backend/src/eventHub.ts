export enum Pallets {
  COUNCIL = 'council',
  DEMOCRACY = 'democracy',
  BALANCES = 'balances',
}

/**
 * An eventhub to create event streams and let the event consumers subscribe to event queues
 */
export class EventHub {
  subscribers: Map<string, any[]>;
  constructor() {
    this.subscribers = new Map(
      Object.values(Pallets).map((pallet) => [pallet, []])
    );
  }
  subscribe(pallets: Pallets[], consumer: any) {
    let subscribers = this.subscribers;
    pallets?.forEach(function (pallet) {
      subscribers.has(pallet) && subscribers.get(pallet)?.push(consumer);
    });
  }
  send(events: any) {
    events.forEach((record) => {
      // Extract the phase, event and the event types
      const { event, phase } = record;
      let pallet = event?.section;
      console.log(phase.toString(), pallet);

      if (this.subscribers.has(pallet)) {
        this.subscribers.get(pallet)?.forEach(function (subscriber) {
          subscriber.notify(event);
        });
      }
    });
  }
}
