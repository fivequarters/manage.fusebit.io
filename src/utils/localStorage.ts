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

export const getDefaultIntegrationConfig = (tenantId: string): IntegrationConfig => {
  return {
    runner: {
      method: 'post',
      url: `/api/tenant/${tenantId}/test`,
      payload: '{}',
    },
  };
};

export const getIntegrationConfig = (integrationId: string, tenantId: string): IntegrationConfig => {
  return {
    ...getDefaultIntegrationConfig(tenantId),
    ...JSON.parse(localStorage.getItem(integrationId) || '{}'),
  } as IntegrationConfig;
};

export const storeIntegrationConfig = (integrationId: string, newData: object) => {
  const previous = JSON.parse(localStorage.getItem(integrationId) || '{}');
  localStorage.setItem(integrationId, JSON.stringify({ ...previous, ...newData }));
};

export const resetIntegrationConfig = (integrationId: string, tenantId: string) => {
  localStorage.setItem(integrationId, JSON.stringify(getDefaultIntegrationConfig(tenantId)));
};
