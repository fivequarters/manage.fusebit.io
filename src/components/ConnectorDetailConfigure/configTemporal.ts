export const configTemporal = {
  // doble data para replicar la res de la api, no mostrarle esto a benn
  data: {
    data: {
      mode: {
        useProduction: true,
      },
      scope: ['chat:write', 'users:read', 'channels:read', 'chat:write.public'],
      clientId: '',
      clientSecret: '',
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
    },
    schema: {
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
          title: 'Bot Token Scopes',
          type: 'object',
          defaultValues: [
            { value: 'chat:write', label: 'chat:write', immutable: true },
            { value: 'users:read', label: 'users:read', immutable: false },
            { value: 'channels:read', label: 'channels:read', immutable: false },
            { value: 'chat:write.public', label: 'chat:write.public', immutable: false },
          ],
          allowArbitraryScopes: true,
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
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/mode/properties/useProduction',
          label: 'Enable Production Credentials',
          options: {
            toggle: true,
          },
        },
        {
          type: 'Group',
          label: 'Fusebit Connector Configuration',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/mode/properties/useProduction',
              schema: {
                const: true,
              },
            },
          },
          elements: [
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/clientId',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/scope',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/defaultEventHandler',
                    },
                  ],
                },
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/clientSecret',
                      options: {
                        format: 'password',
                      },
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/signingSecret',
                      options: {
                        format: 'password',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'Group',
          label: 'Slack Configuration',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/mode/properties/useProduction',
              schema: {
                const: true,
              },
            },
          },
          elements: [
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: '#/properties/constants/properties/urls/properties/callbackUrl',
                },
                {
                  type: 'Control',
                  scope: '#/properties/constants/properties/urls/properties/webhookUrl',
                },
              ],
            },
          ],
        },
        {
          type: 'Group',
          label: 'Advanced Fusebit Options',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/mode/properties/useProduction',
              schema: {
                const: true,
              },
            },
          },
          elements: [
            {
              type: 'HorizontalLayout',
              elements: [
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/authorizationUrl',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/refreshErrorLimit',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/refreshInitialBackoff',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/refreshWaitCountLimit',
                    },
                  ],
                },
                {
                  type: 'VerticalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/tokenUrl',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/refreshBackoffIncrement',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/accessTokenExpirationBuffer',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
