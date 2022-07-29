export const data = {
  mode: {
    useProduction: true,
  },
  advancedOptions: {
    useAdvancedOptions: false,
  },
  scope: 'chat:write users:read channels:read chat:write.public',
  codeBlock: '// Hello World!',
  clientId: 'ecfeac8e136b683cd2b888bf629c355895de13c56aa373d1c65b2b686f90fb32',
  clientSecret: 'f3357a561438d41baef772e57fa63290b68eeed189ab9fafa82575afe36ff8ed',
  refreshErrorLimit: 100000,
  refreshInitialBackoff: 100000,
  refreshWaitCountLimit: 100000,
  refreshBackoffIncrement: 100000,
  accessTokenExpirationBuffer: 500,
  constants: {
    urls: {
      production: {
        tokenUrl: 'https://slack.com/api/oauth.v2.access',
        authorizationUrl: 'https://slack.com/oauth/v2/authorize',
      },
      proxy: {
        tokenUrl:
          'https://stage.us-west-2.fusebit.io/v2/account/acc-2c32ebdb51be4418/subscription/sub-930aa7bb447d43f2/connector/slack-bot-connector-434/proxy/slack/oauth/token',
        authorizationUrl:
          'https://stage.us-west-2.fusebit.io/v2/account/acc-2c32ebdb51be4418/subscription/sub-930aa7bb447d43f2/connector/slack-bot-connector-434/proxy/slack/oauth/authorize',
      },
      webhookUrl:
        'https://stage.us-west-2.fusebit.io/v2/account/acc-2c32ebdb51be4418/subscription/sub-930aa7bb447d43f2/connector/slack-bot-connector-434/api/fusebit/webhook/event',
      callbackUrl:
        'https://stage.us-west-2.fusebit.io/v2/account/acc-2c32ebdb51be4418/subscription/sub-930aa7bb447d43f2/connector/slack-bot-connector-434/api/callback',
    },
  },
  callbackUrl:
    'https://stage.us-west-2.fusebit.io/v2/account/acc-2c32ebdb51be4418/subscription/sub-930aa7bb447d43f2/connector/slack-bot-connector-434/api/callback',
  mountUrl:
    'https://stage.us-west-2.fusebit.io/v2/account/acc-2c32ebdb51be4418/subscription/sub-930aa7bb447d43f2/connector/slack-bot-connector-434',
};
