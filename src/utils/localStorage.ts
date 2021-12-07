import { STATIC_TENANT_ID } from './constants';

export interface IntegrationConfig {
  runner: {
    method: 'post' | 'delete' | 'put' | 'get' | 'patch';
    url: string;
    payload: string;
  };
  session?: {
    url: string;
  };
}

export const DEFAULT_INTEGRATION_CONFIG: IntegrationConfig = {
  runner: {
    method: 'post',
    url: `/api/tenant/${STATIC_TENANT_ID}/test`,
    payload: '{}',
  },
};

export const storeIntegrationInfo = (integrationId: string, newData: object) => {
  const previous = JSON.parse(localStorage.getItem(integrationId) || '');
  localStorage.setItem(integrationId, JSON.stringify({ ...previous, ...newData }));
};

export const resetIntegrationInfo = (integrationId: string) => {
  localStorage.setItem(integrationId, JSON.stringify(DEFAULT_INTEGRATION_CONFIG));
};

export const getIntegrationConfig = (integrationId: string) =>
  JSON.parse(localStorage.getItem(integrationId) || JSON.stringify(DEFAULT_INTEGRATION_CONFIG)) as IntegrationConfig;
