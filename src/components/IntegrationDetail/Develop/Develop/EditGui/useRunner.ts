import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { getAllInstances } from '../../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { useAccountIntegrationCreateSession } from '../../../../../hooks/api/v2/account/integration/session/useCreateOne';
import { useAccountIntegrationTestIntegration } from '../../../../../hooks/api/v2/account/integration/useTestOne';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from '../../../../../hooks/api/v2/account/integration/useGetOne';
import { ApiResponse, useAxios } from '../../../../../hooks/useAxios';
import { useContext } from '../../../../../hooks/useContext';
import { Install } from '../../../../../interfaces/install';
import { Integration } from '../../../../../interfaces/integration';

const useRunner = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const { mutateAsync: createSesssion } = useAccountIntegrationCreateSession();
  const { mutateAsync: testIntegration } = useAccountIntegrationTestIntegration();

  const baseParams = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
  };

  const getInstance = async () => {
    const { data: integration } =
      queryClient.getQueryData<ApiResponse<Integration>>([ACCOUNT_INTEGRATIONS_GET_ONE, { ...baseParams, id }]) || {};

    console.log('integration', integration);

    const {
      data: { items },
    } = await getAllInstances<Install>(
      axios,
      {
        ...baseParams,
        id,
      },
      {
        tag: `fusebit.tenantId=${encodeURIComponent('user-1')}`,
      }
    );

    return (items || [])[0];
  };

  const run = async () => {
    console.log('running');

    const instance = await getInstance();

    if (!instance) {
      console.log('createSesssion');
      await createSesssion({ ...baseParams, id });

      return;
    }

    if (instance) {
      console.log('testing');
      await testIntegration({ id, tenantId: 'user-1' });
      return;
    }
  };

  return {
    run,
  };
};

export default useRunner;
