const getEventSubscriptionSet = (sub, pallet) => {
  let eventSubscriptionSet = new Set();
  if (sub && pallet) {
    let palletSub = sub?.pallets?.find(
      (p) => p?.name?.toLowerCase() === pallet?.toLowerCase()
    );
    let eventSubscription = palletSub?.events;
    eventSubscriptionSet = new Set(
      palletSub?.events?.map((e) => e.toLowerCase()) || []
    );
  }
  return eventSubscriptionSet;
};
export { getEventSubscriptionSet };
