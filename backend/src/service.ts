import { Watcher, Council, Pallets } from './chain';
import { EmailChannel } from './channels/email';
import { EventHub } from './eventHub';

const createWatcher = async () => {
  let eventHub = new EventHub();

  let emailChannelSubscribers: any[] = [];
  let council = new Council();
  // init Council pallet to load members from chain
  await council.loadMembers();
  council.members.forEach((member, key) => {
    if (member?.email) {
      emailChannelSubscribers.push(member?.email);
    }
  });
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
