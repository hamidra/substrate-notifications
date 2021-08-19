/**
 * An email service provider to send notifications through email channels.
 */
const SibApiV3Sdk = require('@sendinblue/client');
import console from 'console';
import { parseEvent, Pallets } from '../chain';
import { apiKey } from '../secrets/sendinBlue-apikey.json';
import { getPalletSubscriptions } from '../controllers/subscriptionController';
import url, { URL } from 'url';

let serviceUrlStr = 'http://localhost:8080/';

export class EmailChannel {
  provider;
  subscribers;
  constructor(subscribers: any[]) {
    this.provider = new EmailProvider();
    this.subscribers = subscribers;
  }
  async notify(rawEvent: any) {
    let { parsed: event, error } = parseEvent(rawEvent);
    if (error) {
      console.log(`An error happened while parsing an event`);
      console.error(error);
      return;
    }

    let getSubsPromises: any[] = [];
    this.subscribers.forEach(({ address }) =>
      getSubsPromises.push(getPalletSubscriptions(address))
    );
    let subs = await Promise.all(getSubsPromises);

    // Filter the subscriptions that have subscribed for that pallet
    subs = subs.filter(
      (sub) => event?.pallet && sub?.pallets?.has(event.pallet)
    );
    //subs.forEach((sub) => this.provider.sendNotification(sub, event));
  }
}

export class EmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || apiKey;
  }

  getSmtpEmailForEvent(event, sub) {
    let subscribeUrl = new URL(
      `management/subscribe/${sub?.address}/${sub?.nonce}`,
      serviceUrlStr
    ).href?.split('://')?.[1];
    let unsubscribeUrl = new URL(
      `management/unsubscribe/${sub?.address}/${sub?.nonce}`,
      serviceUrlStr
    ).href?.split('://')?.[1];
    let recipient = { email: sub?.email };

    switch (event?.pallet) {
      case Pallets.BALANCES:
        if (event?.method === 'Transfer') {
          let params = {
            subscribeUrl,
            unsubscribeUrl,
            from: event?.params?.[0]?.toHuman(),
            to: event?.params?.[1]?.toHuman(),
            value: event?.params?.[2].toHuman(),
          };
          let templateId = 3;
          return {
            to: [recipient],
            templateId,
            params,
          };
        }
        return null;
        break;
      case Pallets.COUNCIL:
        if (event?.method === 'Proposed') {
          let params = {
            subscribeUrl,
            unsubscribeUrl,
            proposedBy: event?.params?.[0]?.toHuman(),
            proposalIndex: event?.params?.[1]?.toHuman(),
            proposalHash: event?.params?.[2]?.toHuman(),
            threshold: event?.params?.[3]?.toHuman(),
          };
          let templateId = 3;
          return {
            to: [recipient],
            templateId,
            params,
          };
        }
        return null;
        break;
      default:
        return null;
    }
  }

  async sendNotification(sub, event) {
    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Configure API key authorization: api-key

    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      this.apiKey
    );
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.partnerKey,
      this.apiKey
    );

    let sendSmtpEmail = this.getSmtpEmailForEvent(event, sub);

    if (sendSmtpEmail) {
      console.log(
        `sending email for event: ${event?.pallet}::${event?.method}`
      );

      apiInstance.sendTransacEmail(sendSmtpEmail).then(
        function (data) {
          console.log('API called successfully');
          // console.log(data);
        },
        function (error) {
          console.error('error');
        }
      );
    } else {
      console.log(
        `no notificatin was configured for this event: ${event?.pallet}::${event?.method}`
      );
    }
  }
}
