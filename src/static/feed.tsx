export const feed = 
    {
      id: "as23w63age",
      name: "A Slack Bot",
      description: "This is a slack bot that _uses_ slack **and** Fusebit.",
      smallIcon: "http://some.icon/some.ico",
      largeIcon: "http://some.icon/large.ico",
      version: "1.5.3",
      tags: {
        "service": "slack",
        "catalog": "messaging, productivity,crm,calendar",
      },
      configuration: {
        title: "Configure your slack integration", // Title and various other text fields for the form.
        schema: {
          type: "object",
          properties: {
            slackConnector: {
              type: "object",
              properties: {
                slackName: {
                  type: "string",
                  minLength: 3,
                  description: "Please enter the name for the slack connector",
                },
              },
            },
          },
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: [
            {
              type: "HorizontalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackConnector/slackName",
                  label: "Name of the connector for Slack",
                },
              ],
            },
          ],
        },
        data: {
          slackConnector: {
            slackName: "slack-connector",
          },
        },
  
        entities: [
          {
            name: "slackConnector",
            entityType: "connector",
            id: "{{this.slackName}}",
            data: {
              files: {
                "package.json": "{...}",
              },
              handler: "@fusebit-int/pkg-oauth-connector",
              configuration: {
                clientSecret: "foobar",
              },
            },
            tags: {
              "catalog.entry": "slack-connector",
            },
          },
          {
            name: "slackIntegration",
            entityType: "integration",
            id: "{{this.slackName}}",
            data: {
              id: "foo",
              data: {
                files: {
                  "package.json": "{...}",
                  "./integration.js": "...",
                },
                handler: "./integration",
                components: [
                  {
                    name: "slackConnector",
                    entityType: "connector",
                    entityId: "{{global.slackConnector.slackName}}",
                    dependsOn: [],
                    package: "@fusebit-int/slack-integration",
                  },
                ],
                componentTags: {
                  foo: "bar2",
                  some: "another",
                  other: "tag",
                  monkey: "banana",
                },
                configuration: {},
              },
            },
            tags: {
              "catalog.entry": "slack-connector",
            },
          },
        ],
      },
    }