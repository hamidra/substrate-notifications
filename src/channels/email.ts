/**
 * An email service provider to send notifications through email channels.
 */
const SibApiV3Sdk = require('sib-api-v3-typescript');
export default class EmailProvider {
  apiKey;
  constructor() {
    this.apiKey = process.env.EmailApiKey || '';
  }
  notify(events: any) {
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
