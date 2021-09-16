export default class SerializedPallet {
  events = [];
  name;
  constructor(pallet) {
    if (pallet) {
      this.name = pallet?.name;
      this.events =
        pallet?.events?.filter((e) => e?.isSubscribed).map((e) => e?.name) ||
        [];
    }
  }
}
