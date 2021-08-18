/**
 * An email service provider to send notifications through email channels.
 */
const SibApiV3Sdk = require('@sendinblue/client');
import console from 'console';
import { parseEvent, Pallets } from '../chain';
import { apiKey } from '../secrets/sendinBlue-apikey.json';
import { getPalletSubscriptions } from '../controllers/subscriptionController';

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

    // create the email list:
    // 1. filter the subscriptions that have subscribed for that pallet
    // 2. map the subs to their registered emails
    let emails = subs
      .filter(({ pallets }) => event?.pallet && pallets?.has(event.pallet))
      .map(({ email }) => email);
    this.provider.sendNotification(emails, event);
  }
}

export class EmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || apiKey;
  }

  getSmtpEmailForEvent(event, recipients) {
    switch (event?.pallet) {
      case Pallets.BALANCES:
        if (event?.method === 'Transfer') {
          let params = {
            from: event?.params?.[0]?.toHuman(),
            to: event?.params?.[1]?.toHuman(),
            value: event?.params?.[2].toHuman(),
          };
          let templateId = 2;
          return {
            to: recipients,
            templateId,
            params,
          };
        }
        return null;
        break;
      case Pallets.COUNCIL:
        if (event?.method === 'Proposed') {
          let params = {
            proposedBy: event?.params?.[0]?.toHuman(),
            proposalIndex: event?.params?.[1]?.toHuman(),
            proposalHash: event?.params?.[2]?.toHuman(),
            threshold: event?.params?.[3]?.toHuman(),
          };
          let templateId = 3;
          return {
            to: recipients,
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

  async sendNotification(emails, event) {
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

    let recipients = emails.map((email) => {
      return { email };
    });

    let sendSmtpEmail = this.getSmtpEmailForEvent(
      event,
      [{ email: 'hamid.alipour@gmail.com' }] /*recipients*/
    );

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
