import CuratedPallet from './curatedPallet';
export default class Pallets {
  curation = { council: { events: ['proposed'] } };
  pallets = [];
  constructor(_pallets) {
    if (_pallets) {
      for (let pallet of _pallets) {
        let p = this.curation[pallet?.name];
        if (p) {
          this.pallets.push(new CuratedPallet(pallet, p.events));
        }
      }
    }
  }
}
