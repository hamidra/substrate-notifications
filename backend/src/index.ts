import express from 'express';
import cors from 'cors';
import service from './service';
import { Pallets } from './chain';
import {
  unsubscribe,
  subscribe,
  getPalletSubscriptionsSecure,
  setAuthenticationToken,
  getNewAuthNonce,
  revokeAuthenticationToken,
} from './controllers/subscriptionController';

const app = express();
const port = process.env.HTTP_PORT || 8080; // default port to listen

// set cors
app.use(cors());

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

// define a route handler for the default home page
app.get('/login/:address/nonce', async (req, res) => {
  let { status, nonce } = await getNewAuthNonce(req.params.address);
  if (status < 400) {
    res.status(status).json({ nonce });
  } else {
    res.status(status).send();
  }
});

// define a route handler for the default home page
app.get('/logout/:address/:token', async (req, res) => {
  let status = await revokeAuthenticationToken({
    address: req.params.address,
    auth_token: req.params.token,
  });
  if (status < 400) {
    res.status(status).send(`${req.params.token} token was revoked`);
  } else {
    res.status(status).send();
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  service.start().catch((err) => console.log(err));
});
