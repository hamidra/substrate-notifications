import watcher from './chianWatcher';
import EmailProvider from './channels/email';
import EventHub from './eventHub';
let eventHub = new EventHub();
eventHub.subscribe(new EmailProvider());
watcher.start(eventHub).catch((err) => console.log(err));
