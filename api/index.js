const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3'),
      { IamAuthenticator } = require('ibm-watson/auth');


const personalityInsights = new PersonalityInsightsV3({
  version: global.appConfig.ibm_watson_config.version,
  authenticator: new IamAuthenticator({
    apikey: global.appConfig.ibm_watson_config.apikey,
  }),
  url: global.appConfig.ibm_watson_config.url
});


module.exports = personalityInsights;