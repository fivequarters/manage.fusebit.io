import { Feed } from '@interfaces/feed';
import { createSampleAppClientUrl } from '@utils/backendClients';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useAuthContext } from './useAuthContext';
import { useGetIntegrationFromCache } from './useGetIntegrationFromCache';

const DEFAULT_ENABLED_APPS = ['slack-bot'];

const useSampleApp = () => {
  const [url, setUrl] = useState('');
  const queryClient = useQueryClient();
  const { userData } = useAuthContext();
  const integration = useGetIntegrationFromCache();

  useEffect(() => {
    const feed = queryClient.getQueryData<Feed[]>('getIntegrationsFeed');
    const integrationFeed = (feed || []).find((i) => i.id === integration?.data.tags['fusebit.feedId']);
    const config: Record<string, string> = {};
    const isEnabled =
      integrationFeed?.sampleConfig?.isEnabled || DEFAULT_ENABLED_APPS.includes(integrationFeed?.id || '');
    const getSampleAppUrl = async () => {
      setUrl(await createSampleAppClientUrl(userData, config));
    };

    if (isEnabled) {
      config[`${integrationFeed?.id}_INTEGRATION_ID`.replaceAll('-', '_').toUpperCase()] = integration?.data.id || '';

      getSampleAppUrl();
    }
  }, [integration, queryClient, userData]);

  return {
    url,
  };
};

export default useSampleApp;
