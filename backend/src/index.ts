import express from 'express';
import service from './service';
import { Pallets } from './chain';
import {
  unsubscribe,
  subscribe,
  getPalletSubscriptionsSecure,
} from './controllers/subscriptionController';

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get('/management/unsubscribe/:address/:nonce', async (req, res) => {
  let status = await unsubscribe({
    address: req.params.address,
    nonce: req.params.nonce,
    pallets: [Pallets.COUNCIL],
  });
  if (status < 400) {
    res
      .status(status)
      .send(
        `your account with address : ${req.params.address} was unsubscribed`
      );
  } else {
    res.status(status).send();
  }
});

// define a route handler for the default home page
app.get('/management/subscribe/:address/:nonce', async (req, res) => {
  let status = await subscribe({
    address: req.params.address,
    pallets: [Pallets.COUNCIL],
  });
  if (status < 400) {
    res
      .status(status)
      .send(`your account with address : ${req.params.address} was subscribed`);
  } else {
    res.status(status).send();
  }
});

// define a route handler for the default home page
app.get('/management/:address/:nonce', async (req, res) => {
  let { status, sub } = await getPalletSubscriptionsSecure({
    address: req.params.address,
    nonce: req.params.nonce,
  });
  if (status < 400) {
    res.status(status).json(sub);
  } else {
    res.status(status).send();
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  service.start().catch((err) => console.log(err));
});
