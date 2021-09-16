import CuratedPallet from './curatedPallet';
import SerializedPallet from './serializedPallet';
export default class Pallets {
  static curation = { council: { events: ['proposed'] } };
  static deserialize(_pallets) {
    if (_pallets) {
      let pallets = [];
      for (let pallet of _pallets) {
        let p = this.curation[pallet?.name];
        if (p) {
          pallets.push(new CuratedPallet(pallet, p.events));
        }
      }
      return pallets;
    } else {
      return null;
    }
  }
  static serialize(_pallets) {
    if (_pallets) {
      let pallets = [];
      for (let pallet of _pallets) {
        pallets.push(new SerializedPallet(pallet));
      }
      return pallets;
    } else {
      return null;
    }
  }
}
