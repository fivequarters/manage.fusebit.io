import slack from "../assets/slack.svg";
import discord from "../assets/discord.svg";
import asana from "../assets/asana.svg";
import { Feed }  from "../interfaces/feed";

export const integrationsFeed: Feed[] = [
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
            slackIntegration: {
              type: "string",
              minLength: 3,
            },
            slackConnector: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["slackIntegration", "slackConnector"],
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackIntegration",
                  label: "Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/slackConnector",
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
            id: "<%connectorId%>",
            data: {
              files: {
                "package.json": "{\"scripts\":{\"deploy\":\"fuse connector deploy {{this.name}} -d .\",\"get\":\"fuse connector get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\",\"@fusebit-int/pkg-oauth-connector\":\"*\"}}",
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
            id: "<%integrationId%>",
            data: {
              id: "<%integrationId%>",
              data: {
                files: {
                  "package.json": "{\"scripts\":{\"deploy\":\"fuse integration deploy {{this.name}} -d .\",\"get\":\"fuse integration get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\"},\"files\":[\"./integration.js\"]}",
                  "./integration.js": "const { Router } = require(\"@fusebit-int/framework\");\nconst router = new Router();\nrouter.get(\"/api/\", async (ctx) => {\n  ctx.body = \"Hello World\";\n});\nmodule.exports = router;\n"
                },
                handler: "./integration",
                components: [
                  {
                    name: "slackConnector",
                    entityType: "connector",
                    entityId: "<%connectorId%>",
                    dependsOn: [],
                    package: "@fusebit-int/pkg-oauth-integration",
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
            slackIntegration: {
              type: "string",
              minLength: 3,
            },
            slackConnector: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["slackIntegration", "slackConnector"],
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackIntegration",
                  label: "Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/slackConnector",
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
            id: "<%connectorId%>",
            data: {
              files: {
                "package.json": "{\"scripts\":{\"deploy\":\"fuse connector deploy {{this.name}} -d .\",\"get\":\"fuse connector get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\",\"@fusebit-int/pkg-oauth-connector\":\"*\"}}",
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
            id: "<%integrationId%>",
            data: {
              id: "<%integrationId%>",
              data: {
                files: {
                  "package.json": "{\"scripts\":{\"deploy\":\"fuse integration deploy {{this.name}} -d .\",\"get\":\"fuse integration get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\"},\"files\":[\"./integration.js\"]}",
                  "./integration.js": "const { Router } = require(\"@fusebit-int/framework\");\nconst router = new Router();\nrouter.get(\"/api/\", async (ctx) => {\n  ctx.body = \"Hello World\";\n});\nmodule.exports = router;\n"
                },
                handler: "./integration",
                components: [
                  {
                    name: "slackConnector",
                    entityType: "connector",
                    entityId: "<%connectorId%>",
                    dependsOn: [],
                    package: "@fusebit-int/pkg-oauth-integration",
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
            slackIntegration: {
              type: "string",
              minLength: 3,
            },
            slackConnector: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["slackIntegration", "slackConnector"],
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackIntegration",
                  label: "Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/slackConnector",
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
            id: "<%connectorId%>",
            data: {
              files: {
                "package.json": "{\"scripts\":{\"deploy\":\"fuse connector deploy {{this.name}} -d .\",\"get\":\"fuse connector get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\",\"@fusebit-int/pkg-oauth-connector\":\"*\"}}",
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
            id: "<%integrationId%>",
            data: {
              id: "<%integrationId%>",
              data: {
                files: {
                  "package.json": "{\"scripts\":{\"deploy\":\"fuse integration deploy {{this.name}} -d .\",\"get\":\"fuse integration get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\"},\"files\":[\"./integration.js\"]}",
                  "./integration.js": "const { Router } = require(\"@fusebit-int/framework\");\nconst router = new Router();\nrouter.get(\"/api/\", async (ctx) => {\n  ctx.body = \"Hello World\";\n});\nmodule.exports = router;\n"
                },
                handler: "./integration",
                components: [
                  {
                    name: "slackConnector",
                    entityType: "connector",
                    entityId: "<%connectorId%>",
                    dependsOn: [],
                    package: "@fusebit-int/pkg-oauth-integration",
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

  export const connectorsFeed: Feed[] = [
    {
      id: "slackkksksksk",
      name: "Slack",
      description: "Slack",
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
            slackIntegration: {
              type: "string",
              minLength: 3,
            },
            slackConnector: {
              type: "string",
              minLength: 3,
            },
            clientId: {
              type: "string",
              minLength: 6,
            },
            clientSecret: {
              type: "string",
              minLength: 6,
            },
            requestUserToken: {
              type: "boolean",
            }
          },
          required: ["slackIntegration", "slackConnector"],
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackIntegration",
                  label: "Slack Integration Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/slackConnector",
                  label: "Slack Connector Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/clientId",
                  label: "Client ID",
                  options: {
                    format: "password",
                  }
                },
                {
                  type: "Control",
                  scope: "#/properties/clientSecret",
                  label: "Client Secret",
                  options: {
                    format: "password",
                  }
                },
                {
                  type: "Control",
                  scope: "#/properties/requestUserToken",
                  label: "Request user token",
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
            id: "<%connectorId%>",
            data: {
              files: {
                "package.json": "{\"scripts\":{\"deploy\":\"fuse connector deploy {{this.name}} -d .\",\"get\":\"fuse connector get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\",\"@fusebit-int/pkg-oauth-connector\":\"*\"}}",
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
            id: "<%integrationId%>",
            data: {
              id: "<%integrationId%>",
              data: {
                files: {
                  "package.json": "{\"scripts\":{\"deploy\":\"fuse integration deploy {{this.name}} -d .\",\"get\":\"fuse integration get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\"},\"files\":[\"./integration.js\"]}",
                  "./integration.js": "const { Router } = require(\"@fusebit-int/framework\");\nconst router = new Router();\nrouter.get(\"/api/\", async (ctx) => {\n  ctx.body = \"Hello World\";\n});\nmodule.exports = router;\n"
                },
                handler: "./integration",
                components: [
                  {
                    name: "slackConnector",
                    entityType: "connector",
                    entityId: "<%connectorId%>",
                    dependsOn: [],
                    package: "@fusebit-int/pkg-oauth-integration",
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
      id: "discord",
      name: "Discord",
      description: "Discord",
      smallIcon: discord,
      largeIcon: "http://some.icon/large.ico",
      version: "2.3.0",
      tags: {
        service: "slack",
        catalog: "messaging, productivity, crm",
      },

      configuration: {
        title: "Configure your slack integration", // Title and various other text fields for the form.
        schema: {
          type: "object",
          properties: {
            slackIntegration: {
              type: "string",
              minLength: 3,
            },
            slackConnector: {
              type: "string",
              minLength: 3,
            },
            clientId: {
              type: "string",
              minLength: 6,
            },
            clientSecret: {
              type: "string",
              minLength: 6,
            },
            requestUserToken: {
              type: "boolean",
            }
          },
          required: ["slackIntegration", "slackConnector"],
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackIntegration",
                  label: "Slack Integration Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/slackConnector",
                  label: "Slack Connector Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/clientId",
                  label: "Client ID",
                  options: {
                    format: "password",
                  }
                },
                {
                  type: "Control",
                  scope: "#/properties/clientSecret",
                  label: "Client Secret",
                  options: {
                    format: "password",
                  }
                },
                {
                  type: "Control",
                  scope: "#/properties/requestUserToken",
                  label: "Request user token",
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
            id: "<%connectorId%>",
            data: {
              files: {
                "package.json": "{\"scripts\":{\"deploy\":\"fuse connector deploy {{this.name}} -d .\",\"get\":\"fuse connector get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\",\"@fusebit-int/pkg-oauth-connector\":\"*\"}}",
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
            id: "<%integrationId%>",
            data: {
              id: "<%integrationId%>",
              data: {
                files: {
                  "package.json": "{\"scripts\":{\"deploy\":\"fuse integration deploy {{this.name}} -d .\",\"get\":\"fuse integration get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\"},\"files\":[\"./integration.js\"]}",
                  "./integration.js": "const { Router } = require(\"@fusebit-int/framework\");\nconst router = new Router();\nrouter.get(\"/api/\", async (ctx) => {\n  ctx.body = \"Hello World\";\n});\nmodule.exports = router;\n"
                },
                handler: "./integration",
                components: [
                  {
                    name: "slackConnector",
                    entityType: "connector",
                    entityId: "<%connectorId%>",
                    dependsOn: [],
                    package: "@fusebit-int/pkg-oauth-integration",
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
      id: "as23r333age",
      name: "Asana",
      description: "Asana",
      smallIcon: asana,
      largeIcon: "http://some.icon/large.ico",
      version: "2.3.0",
      tags: {
        service: "slack",
        catalog: "crm, calendar",
      },

      configuration: {
        title: "Configure your slack integration", // Title and various other text fields for the form.
        schema: {
          type: "object",
          properties: {
            slackIntegration: {
              type: "string",
              minLength: 3,
            },
            slackConnector: {
              type: "string",
              minLength: 3,
            },
            clientId: {
              type: "string",
              minLength: 6,
            },
            clientSecret: {
              type: "string",
              minLength: 6,
            },
            requestUserToken: {
              type: "boolean",
            }
          },
          required: ["slackIntegration", "slackConnector"],
        },
  
        uischema: {
          type: "Group",
          label: "Slack Connector Details",
          elements: {
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: "#/properties/slackIntegration",
                  label: "Slack Integration Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/slackConnector",
                  label: "Slack Connector Name",
                },
                {
                  type: "Control",
                  scope: "#/properties/clientId",
                  label: "Client ID",
                  options: {
                    format: "password",
                  }
                },
                {
                  type: "Control",
                  scope: "#/properties/clientSecret",
                  label: "Client Secret",
                  options: {
                    format: "password",
                  }
                },
                {
                  type: "Control",
                  scope: "#/properties/requestUserToken",
                  label: "Request user token",
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
            id: "<%connectorId%>",
            data: {
              files: {
                "package.json": "{\"scripts\":{\"deploy\":\"fuse connector deploy {{this.name}} -d .\",\"get\":\"fuse connector get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\",\"@fusebit-int/pkg-oauth-connector\":\"*\"}}",
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
            id: "<%integrationId%>",
            data: {
              id: "<%integrationId%>",
              data: {
                files: {
                  "package.json": "{\"scripts\":{\"deploy\":\"fuse integration deploy {{this.name}} -d .\",\"get\":\"fuse integration get {{this.name}} -d .\"},\"dependencies\":{\"@fusebit-int/framework\":\"^2.0.0\"},\"files\":[\"./integration.js\"]}",
                  "./integration.js": "const { Router } = require(\"@fusebit-int/framework\");\nconst router = new Router();\nrouter.get(\"/api/\", async (ctx) => {\n  ctx.body = \"Hello World\";\n});\nmodule.exports = router;\n"
                },
                handler: "./integration",
                components: [
                  {
                    name: "slackConnector",
                    entityType: "connector",
                    entityId: "<%connectorId%>",
                    dependsOn: [],
                    package: "@fusebit-int/pkg-oauth-integration",
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