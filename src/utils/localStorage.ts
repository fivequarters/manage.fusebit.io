export interface IntegrationConfig {
    runner: {
        method: "post" | "delete" | "put" | "get" | "patch"
        url: string
        payload: string
    }
}

const DEFAULT_INTEGRATION_CONFIG: IntegrationConfig = {
    runner: {
        method: 'get',
        url: '',
        payload: ''
    }
}

export const getIntegrationConfig = (integrationId: string) => JSON.parse(localStorage.getItem(integrationId) || JSON.stringify(DEFAULT_INTEGRATION_CONFIG)) as IntegrationConfig;