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
    advancedOptions: {
      type: 'object',
      properties: {
        useAdvancedOptions: {
          type: 'boolean',
        },
      },
    },
    authorizationUrl: {
      title: 'Override the OAuth2 Authorization URL',
      type: 'string',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    tokenUrl: {
      title: 'Override the OAuth2 Token Request URL',
      type: 'string',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    scope: {
      title: 'Bot Token Scopes',
      type: 'object',
      defaultValues: [
        { value: 'chat:write', label: 'chat:write', immutable: true },
        { value: 'users:read', label: 'users:read', immutable: false },
        { value: 'channels:read', label: 'channels:read', immutable: false },
        { value: 'chat:write.public', label: 'chat:write.public', immutable: false },
      ],
      allowArbitraryScopes: true,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    clientId: {
      title: 'The Client ID from your Slack App',
      type: 'string',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    clientSecret: {
      title: 'The Client Secret from your Slack App',
      type: 'string',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    refreshErrorLimit: {
      type: 'integer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    refreshInitialBackoff: {
      type: 'integer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    refreshWaitCountLimit: {
      type: 'integer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    refreshBackoffIncrement: {
      type: 'integer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    accessTokenExpirationBuffer: {
      type: 'integer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    defaultEventHandler: {
      title: 'The Integration ID that will act as the default event handler',
      type: 'string',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
    signingSecret: {
      title: 'Signing Secret from your Slack App',
      type: 'string',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
    },
  },
  required: ['scope', 'clientId', 'clientSecret'],
};
