import subscriptionModel from '../models/subscription';
import { randomAsNumber } from '@polkadot/util-crypto';

export const subscribe = async ({ address, email = null, pallets }) => {
  try {
    if (!address) {
      console.log(`No address was provided for subscription.`);
      return 400;
    }
    let sub =
      (await subscriptionModel.get(address)) ||
      new subscriptionModel({ address, nonce: randomAsNumber().toString() });

    pallets?.forEach((pallet) => {
      if (!sub.pallets) {
        sub.pallets = new Set([pallet]);
      } else {
        sub.pallets.add(pallet);
      }
    });
    if (email) {
      sub.email = email;
    }
    await sub.save();
    return 200;
  } catch (error) {
    console.error(error);
    return 505;
  }
};

export const unsubscribe = async ({ address, nonce, pallets }) => {
  try {
    let sub = await subscriptionModel.get(address);
    if (sub?.nonce != nonce) {
      return 403;
    }
    if (sub && pallets?.length) {
      pallets?.forEach((pallet) => sub.pallets?.delete(pallet));
      if (!sub.pallets?.size) {
        // dynamoose won't let the string sets to be empty, hence we need to drop pallets if the field is empty
        delete sub.pallets;
      }
      await sub.save();
    }
    return 200;
  } catch (error) {
    console.error(error);
    return 505;
  }
};

export const getPalletSubscriptions = async (address) => {
  try {
    let sub = await subscriptionModel.get(address);
    return sub || [];
  } catch (error) {
    console.error(error);
  }
};

export const getPalletSubscriptionsSecure = async ({ address, nonce }) => {
  try {
    let sub = await subscriptionModel.get(address);
    sub.pallets = [...(sub?.pallets || [])];
    if (sub?.nonce != nonce) {
      return { status: 403 };
    }
    if (sub) {
      return { status: 200, sub };
    } else {
      return { status: 404 };
    }
  } catch (error) {
    console.error(error);
    return { status: 505 };
  }
};
