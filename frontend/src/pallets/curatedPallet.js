export default class CuratedPallet {
  events = [];
  name;
  constructor(pallet, curatedEvents) {
    let subscribedSet = new Set(pallet?.events);
    if (pallet) {
      this.name = pallet?.name;
      for (let event of curatedEvents) {
        this.events.push({
          name: event,
          isSubscribed: subscribedSet.has(event) ? true : false,
        });
      }
    }
  }
}
