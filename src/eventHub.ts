/**
 * An eventhub to create event streams and let the event consumers subscribe to event queues
 */

export default class EventHub {
  subscribers: any;
  constructor() {
    this.subscribers = [];
  }
  subscribe(consumer: any) {
    this.subscribers.push(consumer);
  }
  send(events: any) {
    for (let subscriber of this.subscribers) {
      subscriber.notify(events);
    }
  }
}
