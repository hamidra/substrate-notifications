import CuratedPallet from './curatedPallet';
import SerializedPallet from './serializedPallet';
import curation from './curation.json';
export default class Pallets {
  static curate(_pallets) {
    let pallets = [];
    let configuredPallets = new Set(Object.keys(curation));
    // curate all the pallets that are already configured by the user
    if (_pallets) {
      _pallets.forEach((pallet) => {
        let p = curation[pallet?.name];
        if (p) {
          pallets.push(new CuratedPallet(pallet, p.events));
          // now that they are configured remove them from set
          configuredPallets.delete(pallet?.name);
        }
      });
    }
    // for any configured pallet that there is no user subscription curate a pallet with all events set to unsubscribed
    configuredPallets.forEach((palletName) => {
      let curatedEvents =
        curation[palletName]?.events?.map((eventName) => ({
          name: eventName,
          isSubscribed: false,
        })) || [];
      let curatedPallet = { name: palletName, events: curatedEvents };
      pallets.push(curatedPallet);
    });
    return pallets;
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
