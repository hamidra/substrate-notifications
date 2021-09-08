import express from 'express';
import { Pallets } from '../chain';
import {
  updatePalletSubscriptions,
  getSubscriptionsSecure,
} from '../controllers/subscriptionController';
import pallet from '../models/pallet';

const router = express.Router();

// define a route handler for the default home page
router.get('/unsubscribe/:address/:nonce', async (req, res) => {
  try {
    // currently will unsubscribe from council events:
    let unsubscribedPallets = [new pallet({ name: Pallets.COUNCIL })];
    let status = await updatePalletSubscriptions({
      address: req.params.address,
      nonce: req.params.nonce,
      pallets: unsubscribedPallets,
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
    let subscribedPallets = [
      new pallet({
        name: Pallets.COUNCIL,
        events: new Set(['proposed']),
      }),
    ];
    let status = await updatePalletSubscriptions({
      address: req.params.address,
      nonce: req.params.nonce,
      pallets: subscribedPallets,
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
    let { status, sub } = await getSubscriptionsSecure({
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
