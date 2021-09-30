import { STATIC_TENANT_ID } from "./constants";

export interface IntegrationConfig {
  runner: {
    method: 'post' | 'delete' | 'put' | 'get' | 'patch';
    url: string;
    payload: string;
  };
}

export const DEFAULT_INTEGRATION_CONFIG: IntegrationConfig = {
  runner: {
    method: 'post',
    url: `/api/tenant/${STATIC_TENANT_ID}/test`,
    payload: '{}',
  },
};

export const getIntegrationConfig = (integrationId: string) =>
  JSON.parse(localStorage.getItem(integrationId) || JSON.stringify(DEFAULT_INTEGRATION_CONFIG)) as IntegrationConfig;
