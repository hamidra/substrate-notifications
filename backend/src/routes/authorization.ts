import express from 'express';
const router = express.Router();
import { getNewAuthNonce } from '../controllers/subscriptionController';
import { authenticate } from '../authentication';

// define a route handler for the default home page
router.get('/:address/nonce', async (req, res) => {
  try {
    let { status, nonce } = await getNewAuthNonce(req.params.address);
    if (status < 400) {
      res.status(status).json({ nonce });
    } else {
      res.status(status).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// define a route handler for the default home page
router.get('/', async (req, res) => {
  try {
    let { status, w3token, claims } = authenticate(req) || {};
    if (!status) {
      console.log('something went wrong. not able to authenticate the request');
      res.status(500).send();
    }
    if (status === 200) {
      res.cookie('w3token', w3token, { httponly: true });
      res.status(status).send();
    } else {
      res.status(status).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

export default router;
