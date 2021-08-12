import subscriptionModel from '../models/subscription';

export const subscribe = async (address, pallets) => {
  try {
    let sub = await subscriptionModel.get(address);
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
      await sub.save();
    }
  } catch (error) {
    console.error(error);
  }
};
