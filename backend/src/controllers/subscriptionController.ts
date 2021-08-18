import subscriptionModel from '../models/subscription';

export const subscribe = async (address, pallets) => {
  try {
    let sub =
      (await subscriptionModel.get(address)) ||
      new subscriptionModel({ address, pallets: new Set(['NA']) });
    pallets?.forEach((pallet) => sub.pallets.add(pallet));
    await sub.save();
  } catch (error) {
    console.error(error);
  }
};
export const unsubscribe = async (address, pallets) => {
  try {
    let sub = await subscriptionModel.get(address);
    if (sub) {
      pallets?.forEach((pallet) => sub.pallets?.delete(pallet));
      if (!sub.pallets?.size) {
        sub.pallets = new Set();
      }
      await sub.save();
    }
  } catch (error) {
    console.error(error);
  }
};

export const getSubscriptions = async (address) => {
  try {
    let sub = await subscriptionModel.get(address);
    return sub?.pallets || [];
  } catch (error) {
    console.error(error);
  }
};
