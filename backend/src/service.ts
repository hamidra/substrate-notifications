import { Watcher, FinalizedWatcher, Council, Pallets } from './chain';
import { EmailChannel } from './channels/email';
import { EventHub } from './eventHub';
import { subscribe } from './controllers/subscriptionController';
import pallet from './models/pallet';

const createWatcher = async () => {
  let eventHub = new EventHub();

  let emailChannelSubscribers: any[] = [];

  // init Council pallet to load members from chain
  let council = new Council();

  let subscribePromises: any[] = [];
  await council.loadMembers();
  let councilPallet = new pallet({
    name: 'council',
    events: new Set(['proposed']),
  });
  council.members.forEach((member, address) => {
    if (member?.email) {
      emailChannelSubscribers.push({ address, email: member?.email });
      subscribe({
        address,
        email: member.email,
        pallets: [councilPallet],
      });
      subscribePromises.push();
    }
  });
  await Promise.all(subscribePromises);

  console.log(council.members);

  //injecting this as a test account
  emailChannelSubscribers.push({
    address: '1pDEYdBRd8G4VNZDTiojJ7kxwpYAvb9wq5whdSBDn1ASnwW',
    email: 'hamid.alipour@gmail.com',
  });

  eventHub.subscribe(
    [Pallets.COUNCIL, Pallets.DEMOCRACY],
    new EmailChannel(emailChannelSubscribers)
  );
  let watcher = new FinalizedWatcher();
  return { eventHub, watcher };
};

export default {
  start: async () => {
    let { watcher, eventHub } = await createWatcher();
    return watcher.start(eventHub);
  },
};
