/**
 * An email service provider to send notifications through email channels.
 */
const SibApiV3Sdk = require('sib-api-v3-typescript');
export class EmailChannel {
  provider;
  emails;
  constructor(emails: any[]) {
    this.provider = new EmailProvider();
    this.emails = emails;
  }
  async notify(event: any) {
    const types = event.typeDef;
    // 1- prepare notification email
    let data = `${event.section}:${event.method} \n
                ${event.meta.documentation.toString()}`;

    // Loop through each of the parameters, displaying the type and data
    /*event.data.forEach((data, index) => {
      console.log(`\t${types[index].type}: ${data.toString()}`);
    });*/

    // 2- submite notification
    for (let email of this.emails) {
      this.provider.sendNotification(email, data);
    }
  }
}

export class EmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || '';
  }
  async sendNotification(email, data) {
    let apiInstance = new SibApiV3Sdk.AccountApi();
    console.log('sending email');
    console.log(email);
    console.log(data);
    console.log('--------------------');
  }
}

export class AmazonEmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || '';
  }
  async sendNotification(email, data) {
    let apiInstance = new SibApiV3Sdk.AccountApi();
    console.log('sending email');
    console.log(email);
    console.log(data);
    console.log('--------------------');
  }
}
