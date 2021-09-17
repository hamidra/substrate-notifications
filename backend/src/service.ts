import { Watcher, FinalizedWatcher, Council, Pallets } from './chain';
import { EmailChannel } from './channels/email';
import { EventHub } from './eventHub';
import { createSubscription } from './controllers/subscriptionController';

const createWatcher = async () => {
  let eventHub = new EventHub();

  let emailChannelSubscribers: any[] = [];

  // init Council pallet to load members from chain
  let council = new Council();

  let subscribePromises: any[] = [];
  await council.loadMembers();
  let councilPallet = {
    name: Pallets.COUNCIL,
    events: ['proposed'],
  };
  council.members.forEach((member, address) => {
    if (member?.email) {
      emailChannelSubscribers.push({ address, email: member?.email });
      subscribePromises.push(
        createSubscription({
          address,
          email: member.email,
          pallets: [councilPallet],
        })
      );
    }
  });
  await Promise.all(subscribePromises);

  console.log(council.members);

  //injecting this as a test account
  emailChannelSubscribers.push({
    address: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
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
