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
    return 500;
  }
};

export const unsubscribe = async ({ address, nonce, pallets }) => {
  try {
    if (!address) {
      console.log(`No address was provided for subscription.`);
      return 400;
    }

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
    return 500;
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
    if (!address) {
      console.log(`No address was provided for subscription.`);
      return { status: 400 };
    }
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
    return { status: 500 };
  }
};

export const getSubscriptions = async (address) => {
  try {
    if (!address) {
      console.log(`No address was provided for subscription.`);
      return { status: 400 };
    }

    let sub = await subscriptionModel.get(address);
    return { status: 200, sub };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
};

// Authentications

export const getNewAuthNonce = async (address) => {
  let auth_nonce = randomAsNumber().toString();
  try {
    if (!address) {
      console.log(`No address was provided.`);
      return { status: 400 };
    }
    let sub = await subscriptionModel.update(
      { address },
      { $ADD: { auth_nonce: [auth_nonce] } }
    );
    console.log(sub);
    return { status: 200, nonce: auth_nonce };
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
};

export const setAuthenticationToken = async ({
  address,
  auth_token,
  nonce,
}) => {
  try {
    if (!address) {
      console.log(`No address was provided.`);
      return 400;
    }
    if (!auth_token) {
      console.log(`No authentication token was provided.`);
      return 400;
    }
    let sub = await subscriptionModel.get(address);
    if (sub) {
      if (sub?.auth_nonce?.has(nonce)) {
        sub.auth_nonce.delete(nonce);
        // dynamoose won't let the string sets to be empty, hence we need to drop the field if the field is empty
        sub.auth_nonce.size === 0 && delete sub.auth_nonce;

        // set the token
        if (!sub.auth_tokens) {
          sub.auth_tokens = new Set([auth_token]);
        } else {
          sub.auth_tokens.add(auth_token);
        }
        sub.save();

        return 200;
      } else {
        console.log(
          `No pending authentication was found for the nonce: ${nonce}`
        );
        return 403;
      }
    } else {
      console.log(`No subscription was found for address`);
      return 400;
    }

    return 200;
  } catch (error) {
    console.error(error);
    return 500;
  }
};

export const revokeAuthenticationToken = async ({ address, auth_token }) => {
  try {
    if (!address) {
      console.log(`No address was provided.`);
      return 400;
    }
    if (!auth_token) {
      console.log(`No authentication token was provided.`);
      return 400;
    }
    let sub = await subscriptionModel.update(
      { address },
      { $DELETE: { auth_tokens: [auth_token] } }
    );
    console.log(sub);
    return 200;
  } catch (error) {
    console.error(error);
    return 500;
  }
};
