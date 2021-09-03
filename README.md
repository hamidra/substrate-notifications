# Substrate Notifications Service (SNS) :phone: :email:
A notification service that would let users of substrate-based blockchains register to recieve different types of notifications when an specific event happens on the chain. 

## Why?!
The current substrate blockchain tools mostly provide a oneway communication with the chain as in the users can use different tools(e.x. polkadot.js app, subxt, ...) to interact with the chain by sending extrincics, but when it comes to receiving information about what is happenning on the chain at each moment, they need to regularly go and check the state of the chain since the current designs are pull based. It would be nice and time-saving if they were provided with a service which would push different notifications regarding the interesting events that are happening on the chain to the users through their favorite channels (email, mobile, messaging apps and such).

## What?
A notification service that would let the users subscribe to specific events on the chain and receive notifications through the registered channel (email, text message, webhooks) when the specified event has happened on the chain. The service can provide the functionality for events in different levels (system, pallet, extrinsic, ... ). 

### Phase 1:
To start we will scope the project to a specific target, **council members with an email address registered on the chain in their identity info**. They can recieve a notifications whenever a new council motion is present, and they need to vote.
For example 
- the service can send a notification when a motion is created, 
- one more notification 2 days before it closes (if they didnt vote)
- another notification 2 hours before it closes (if they didnt vote).

They will have the option to opt-out of the service (similar to unsubscribe option from mailing lists)

### Phase 2:
The service can be scaled up to notify all users on the blockchain with an identity email. They can subscribe and opt-in to recieve email notifications about DEMOCRACY votes.

### phase 3:
depending on how the service has scaled up, add a subscription UX to open it up to the public to let the users subscribe to different events with different parameters to recieve notifications through different channels. 
To disintensivise bad behaviors/spams:
- Users must register their identities and channels on chain in order to use the service. (also a good incentive for users to get onchian identities)
- set a quota on the number of event triggers they can subscribe to per account

useful usecases:
- A multisig wallet has a new pending approval
- A time delay proxy call had just ﬁnished the amount of time delay blocks
- A schedules transaction has gone through
- An account balance goes below a certain amount
- A runtime upgrade has been scheduled
- Staking rewards are available for payout
- A crowdloan has surpassed a threshold of funds contributed


Can also add scripts/docs to let anyone who is intrested to selfhost the service.


## How:
Substrate already has the concept of events and will store them in the storage of the System module. Polkadot-JS API supports subscription on runtime events. We can use a pub-sub design to let users subscribe different channels for events and publish a notificaton through the subscribed channel when the event is triggered.  

<br/>
<br/>

**[Highlevel architecture]():**
![Substrate Notification Service (1)](https://user-images.githubusercontent.com/5099795/132052860-eff5eb9f-a766-4101-bc27-5c7057943d99.jpg)





For **phase1 and phase2**:
- Use Polkadot.js apis to subscribe to on chain events (council and democracy):
``` javascript=12

  // Subscribe to system events via storage
  api.query.system.events((events) => {

    // Loop through the Vec<EventRecord>
    events.forEach((record) => {
      // Extract the phase, event and the event types
      const { event, phase } = record;
      subscribers.Notify(event)
    });
  }
```
- Use an email service provider for sending notifiations.
