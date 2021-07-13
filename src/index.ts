import watcher from './chianWatcher';
import { EmailChannel } from './channels/email';
import { EventHub, Pallets } from './eventHub';
let eventHub = new EventHub();
eventHub.subscribe(
  [Pallets.COUNCIL, Pallets.DEMOCRACY, Pallets.BALANCES],
  new EmailChannel()
);
watcher.start(eventHub).catch((err) => console.log(err));
