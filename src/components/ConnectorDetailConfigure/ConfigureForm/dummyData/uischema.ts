export const uischema = {
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
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/clientId',
            },
            {
              type: 'Control',
              scope: '#/properties/clientSecret',
              options: {
                format: 'password',
              },
            },
            {
              type: 'MultiControl',
              scope: '#/properties/scope',
            },
            {
              type: 'Control',
              scope: '#/properties/defaultEventHandler',
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
      type: 'VerticalLayout',
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
          type: 'Control',
          label: 'Advanced Fusebit Options',
          scope: '#/properties/advancedOptions/properties/useAdvancedOptions',
          options: {
            toggle: true,
          },
        },
        {
          type: 'VerticalLayout',
          rule: {
            effect: 'SHOW',
            condition: {
              scope: '#/properties/advancedOptions/properties/useAdvancedOptions',
              schema: {
                const: true,
              },
            },
          },
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
};
