import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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
import { authenticate } from './authentication';
import config from './config.json';

const app = express();
const port = process.env.HTTP_PORT || 8080; // default port to listen

// set cookie parser
app.use(cookieParser());

// set cors
app.use(cors({ credentials: true, origin: config.ALLOW_ORIGIN }));

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
app.get('/authorize/:address/nonce', async (req, res) => {
  let { status, nonce } = await getNewAuthNonce(req.params.address);
  if (status < 400) {
    res.status(status).json({ nonce });
  } else {
    res.status(status).send();
  }
});

// define a route handler for the default home page
app.get('/authorize', async (req, res) => {
  let { status, w3token, claims } = authenticate(req) || {};
  if (!status) {
    console.log('something went wrong. not able to authenticate the request');
    res
      .status(500)
      .send('something went wrong. not able to authenticate the request');
  }
  if (status === 200) {
    res.cookie('w3token', w3token, { httponly: true });
    res.status(status).send();
  } else {
    res.status(status).send();
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  service.start().catch((err) => console.log(err));
});
