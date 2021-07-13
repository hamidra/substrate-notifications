/**
 * An email service provider to send notifications through email channels.
 */
const SibApiV3Sdk = require('sib-api-v3-typescript');
export class EmailChannel {
  provider;

  constructor() {
    this.provider = new EmailProvider();
  }
  async notify(event: any) {
    const types = event.typeDef;
    console.log(`${event.section}:${event.method}`);

    console.log(`\t${event.meta.documentation.toString()}`);

    // Loop through each of the parameters, displaying the type and data
    event.data.forEach((data, index) => {
      console.log(`\t${types[index].type}: ${data.toString()}`);
    });
  }
}

export class EmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || '';
  }
  async sendNotification(event) {
    let apiInstance = new SibApiV3Sdk.AccountApi();

    // Configure API key authorization: apiKey

    apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, this.apiKey);

    apiInstance.getAccount().then(
      function (data) {
        console.log(`API called successfully. Returned data:`, data);
      },
      function (error) {
        console.error('error');
      }
    );
  }
}
