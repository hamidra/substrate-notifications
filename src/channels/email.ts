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
    this.provider.sendNotification(this.emails, data);
  }
}

export class EmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || '';
  }
  async sendNotification(emails, data) {
    console.log('sending email');
    console.log(emails);
    console.log(data);
    console.log('--------------------');

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Configure API key authorization: api-key

    apiInstance.authentications['apiKey'].apiKey = this.apiKey;
    apiInstance.authentications['partnerKey'].apiKey = this.apiKey;

    let recipients = emails.forEach((email) => {
      email;
    });
    var sendSmtpEmail = {
      to: [{ email: 'hamid.alipour@gmail.com' }],
      templateId: 1,
      params: {
        motion: '#1',
      },
    };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log('API called successfully. Returned data: ' + data);
      },
      function (error) {
        console.error(error);
      }
    );
  }
}

export class AmazonEmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || '';
  }
  async sendNotification(emails, data) {
    let apiInstance = new SibApiV3Sdk.AccountApi();
    console.log('sending email');
    console.log(emails);
    console.log(data);
    console.log('--------------------');
  }
}
