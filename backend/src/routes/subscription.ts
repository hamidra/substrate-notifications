import express from 'express';
import { Pallets } from '../chain';
import {
  updatePalletSubscriptions,
  updatePalletSubscriptionsSecure,
  getSubscriptionsSecure,
  getSubscriptions,
} from '../controllers/subscriptionController';
import auth from '../middlewares/auth';
import { PalletSchema } from '../models/pallet';

const router = express.Router();

// define a route handler for the default home page
router.get('/unsubscribe/:address/:nonce', async (req, res) => {
  try {
    // currently will unsubscribe from council events:
    let status = await updatePalletSubscriptionsSecure({
      address: req.params.address,
      nonce: req.params.nonce,
      pallets: [],
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
      {
        name: Pallets.COUNCIL,
        events: ['proposed'],
      },
    ];
    let status = await updatePalletSubscriptionsSecure({
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

router.get('/:address', auth, async (req, res) => {
  try {
    let { status, sub } = await getSubscriptions({
      address: req.params.address,
    });
    if (status < 300) {
      res.status(status).json(sub);
    } else {
      res.status(status).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post('/:address/pallets', auth, async (req, res) => {
  try {
    let pallets: any[] = [];
    let curatedPallets = new Set(Object.values(Pallets));
    if (req?.body?.pallets) {
      for (let pallet of req.body.pallets) {
        if (curatedPallets.has(pallet?.name?.toLowerCase())) {
          pallets.push({ name: pallet.name, events: pallet.events });
        }
      }
      let status = await updatePalletSubscriptions({
        address: req.params.address,
        pallets,
      });
      res.status(status).send();
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

export default router;
