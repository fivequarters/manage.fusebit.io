import slack from "../assets/slack.svg";

export const integrationsFeed = [
    {
      id: "as23w63ag32525e",
      name: "Slack Chatbot",
      description: "A conversational **Slack** bot that responds yo you.",
      smallIcon: slack,
      largeIcon: "http://some.icon/large.ico",
      version: "1.0.3",
      tags: {
        service: "slack",
        catalog: "messaging, productivity, crm, calendar",
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
                },
              },
            },
          },
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackName",
                  label: "Slack Connector name",
                },
              ],
            },
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
    },
    {
      id: "w6age",
      name: "Slack Actions Bot",
      description: "A slack actions bot that does cool stuff",
      smallIcon: slack,
      largeIcon: "http://some.icon/large.ico",
      version: "1.5.3",
      tags: {
        service: "slack",
        catalog: "crm, calendar",
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
                },
              },
            },
          },
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackName",
                  label: "Slack Connector name",
                },
              ],
            },
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
    },
    {
      id: "as23age",
      name: "Slack Notification Feed",
      description: "Just a cool Slack notification feed to save you headaches",
      smallIcon: slack,
      largeIcon: "http://some.icon/large.ico",
      version: "2.3.0",
      tags: {
        service: "slack",
        catalog: "messaging",
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
                },
              },
            },
          },
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackName",
                  label: "Slack Connector name",
                },
              ],
            },
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
  ];