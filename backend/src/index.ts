import express from 'express';
import service from './service';
import { Pallets } from './chain';
import { unsubscribe, subscribe } from './controllers/subscriptionController';

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get('/unsubscribe/:address/', (req, res) => {
  unsubscribe({ address: req.params.address, pallets: [Pallets.COUNCIL] });
  res.send(`your account with address : ${req.params.email} was unsubscribed`);
});

// define a route handler for the default home page
app.get('/subscribe/:address/', (req, res) => {
  subscribe({ address: req.params.address, pallets: [Pallets.COUNCIL] });
  res.send(`your account with address : ${req.params.email} was subscribed`);
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  service.start().catch((err) => console.log(err));
});
