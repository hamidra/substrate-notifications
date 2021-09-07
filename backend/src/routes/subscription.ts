import express from 'express';
import { Pallets } from '../chain';
import {
  unsubscribe,
  subscribe,
  getPalletSubscriptionsSecure,
} from '../controllers/subscriptionController';

const router = express.Router();

// define a route handler for the default home page
router.get('/unsubscribe/:address/:nonce', async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// define a route handler for the default home page
router.get('/subscribe/:address/:nonce', async (req, res) => {
  try {
    let status = await subscribe({
      address: req.params.address,
      pallets: [Pallets.COUNCIL],
    });
    if (status < 400) {
      res
        .status(status)
        .send(
          `your account with address : ${req.params.address} was subscribed`
        );
    } else {
      res.status(status).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// define a route handler for the default home page
router.get('/:address/:nonce', async (req, res) => {
  try {
    let { status, sub } = await getPalletSubscriptionsSecure({
      address: req.params.address,
      nonce: req.params.nonce,
    });
    if (status < 400) {
      res.status(status).json(sub);
    } else {
      res.status(status).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

export default router;
