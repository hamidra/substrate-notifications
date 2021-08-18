import { Watcher, Council, Pallets } from './chain';
import { EmailChannel } from './channels/email';
import { EventHub } from './eventHub';
import { subscribe } from './controllers/subscriptionController';

const createWatcher = async () => {
  let eventHub = new EventHub();

  let emailChannelSubscribers: any[] = [];

  // init Council pallet to load members from chain
  let council = new Council();

  let subscribePromises: any[] = [];
  await council.loadMembers();

  council.members.forEach((member, address) => {
    if (member?.email) {
      emailChannelSubscribers.push({ address, email: member?.email });
      subscribePromises.push(
        subscribe({
          address,
          email: member.email,
          pallets: [Pallets.COUNCIL],
        })
      );
    }
  });
  await Promise.all(subscribePromises);
  console.log(council.members);

  eventHub.subscribe(
    [Pallets.COUNCIL, Pallets.DEMOCRACY, Pallets.BALANCES],
    new EmailChannel(emailChannelSubscribers)
  );
  let watcher = new Watcher();
  return { eventHub, watcher };
};

export default {
  start: async () => {
    let { watcher, eventHub } = await createWatcher();
    return watcher.start(eventHub);
  },
};
