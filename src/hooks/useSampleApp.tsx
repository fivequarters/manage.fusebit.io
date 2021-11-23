import { useParams } from 'react-router-dom';
import { useAccountIntegrationsGetOne } from './api/v2/account/integration/useGetOne';
import { useAuthContext } from './useAuthContext';

const useSampleApp = () => {
  const { id: integrationId } = useParams<{ id: string }>();
  const { userData } = useAuthContext();

  const { data: integrationData } = useAccountIntegrationsGetOne({
    enabled: userData.token,
    id: integrationId,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const supportedTypeMap: Record<string, string> = {
    slackConnector: 'slack',
  };

  const componentMap =
    integrationData?.data.data?.components
      ?.map((component) => supportedTypeMap[component.name])
      .filter((type) => !!type)
      .reduce<Record<string, string>>((acc, cur) => {
        acc[cur] = integrationData?.data.id;
        return acc;
      }, {}) || {};

  const isSampleAppEnabled = !!Object.keys(componentMap).length;

  return {
    isSampleAppEnabled,
    componentMap,
  };
};

export default useSampleApp;
