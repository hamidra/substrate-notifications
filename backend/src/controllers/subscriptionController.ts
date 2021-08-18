import subscriptionModel from '../models/subscription';

export const subscribe = async ({ address, email = null, pallets }) => {
  try {
    if (!address) {
      throw Error(`No address was provided for subscription.`);
    }
    let sub =
      (await subscriptionModel.get(address)) ||
      new subscriptionModel({ address });

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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const unsubscribe = async ({ address, pallets }) => {
  try {
    let sub = await subscriptionModel.get(address);
    if (sub && pallets?.size) {
      pallets?.forEach((pallet) => sub.pallets?.delete(pallet));
      if (!sub.pallets?.size) {
        // dynamoose won't let the string sets to be empty, hence we need to drop pallets if the field is empty
        delete sub.pallets;
      }
      await sub.save();
    }
  } catch (error) {
    console.error(error);
  }
};

export const getPalletSubscriptions = async (address) => {
  try {
    let sub = await subscriptionModel.get(address);
    return sub?.pallets || [];
  } catch (error) {
    console.error(error);
  }
};
