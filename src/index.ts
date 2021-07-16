import { Watcher, Council } from './chian';
import { EmailChannel } from './channels/email';
import { EventHub, Pallets } from './eventHub';

const createWatcher = async () => {
  let eventHub = new EventHub();

  let emailSubscribers: any[] = [];
  let council = new Council();
  // init Council pallet to load members from chain
  await council.loadMembers();
  council.members.forEach((member, key) => {
    if (member?.email) {
      emailSubscribers.push(member?.email);
    }
  });
  eventHub.subscribe(
    [Pallets.COUNCIL, Pallets.DEMOCRACY, Pallets.BALANCES],
    new EmailChannel(emailSubscribers)
  );
  let watcher = new Watcher();
  return { eventHub, watcher };
};

let watch = async () => {
  let { watcher, eventHub } = await createWatcher();
  watcher.start(eventHub);
};

watch().catch((err) => console.log(err));
