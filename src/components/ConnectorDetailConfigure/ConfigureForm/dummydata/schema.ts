export const schema = {
  type: 'object',
  properties: {
    mode: {
      type: 'object',
      properties: {
        useProduction: {
          title: 'Production Credentials',
          type: 'boolean',
        },
      },
    },
    constants: {
      type: 'object',
      properties: {
        urls: {
          type: 'object',
          properties: {
            callbackUrl: {
              title: 'OAuth2 Redirect URL',
              type: 'string',
              readOnly: true,
              copy: true,
            },
            webhookUrl: {
              title: 'Events API Request URL',
              type: 'string',
              readOnly: true,
              copy: true,
            },
          },
        },
      },
    },
    authorizationUrl: {
      title: 'Override the OAuth2 Authorization URL',
      type: 'string',
    },
    tokenUrl: {
      title: 'Override the OAuth2 Token Request URL',
      type: 'string',
    },
    scope: {
      title: 'Bot Token Scopes (space separated)',
      type: 'string',
    },
    codeBlock: {
      title: 'Custom Javascript Code',
      type: 'string',
    },
    clientId: {
      title: 'The Client ID from your Slack App',
      type: 'string',
    },
    clientSecret: {
      title: 'The Client Secret from your Slack App',
      type: 'string',
    },
    refreshErrorLimit: {
      type: 'integer',
    },
    refreshInitialBackoff: {
      type: 'integer',
    },
    refreshWaitCountLimit: {
      type: 'integer',
    },
    refreshBackoffIncrement: {
      type: 'integer',
    },
    accessTokenExpirationBuffer: {
      type: 'integer',
    },
    defaultEventHandler: {
      title: 'The Integration ID that will act as the default event handler',
      type: 'string',
    },
    signingSecret: {
      title: 'Signing Secret from your Slack App',
      type: 'string',
    },
  },
  required: ['scope', 'clientId', 'clientSecret'],
};
