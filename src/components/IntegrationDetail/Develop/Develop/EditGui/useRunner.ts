import { useQueryClient } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { getAllInstances } from '../../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { useAccountIntegrationCreateSession } from '../../../../../hooks/api/v2/account/integration/session/useCreateOne';
import { useAccountIntegrationCommitSession } from '../../../../../hooks/api/v2/account/integration/session/useCommitOne';
import { useAccountIntegrationTestIntegration } from '../../../../../hooks/api/v2/account/integration/useTestOne';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from '../../../../../hooks/api/v2/account/integration/useGetOne';
import { ApiResponse, useAxios } from '../../../../../hooks/useAxios';
import { useContext } from '../../../../../hooks/useContext';
import { Install } from '../../../../../interfaces/install';
import { Integration } from '../../../../../interfaces/integration';
import { useEffect } from 'react';
import { useQuery } from '../../../../../hooks/useQuery';

export const STATIC_TENANT_ID = 'user-1';

const useRunner = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const { mutateAsync: createSesssion } = useAccountIntegrationCreateSession();
  const { mutateAsync: testIntegration } = useAccountIntegrationTestIntegration();
  const { mutate: commitSession } = useAccountIntegrationCommitSession();

  const query = useQuery();

  const baseParams = {
    subscriptionId: userData.subscriptionId,
    accountId: userData.accountId,
  };

  const getInstance = async () => {
    const {
      data: { items },
    } = await getAllInstances<Install>(
      axios,
      {
        ...baseParams,
        id,
      },
      {
        tag: `fusebit.tenantId=${STATIC_TENANT_ID}`,
      }
    );

    return (items || [])[0];
  };

  useEffect(() => {
    const sessionId = query.get('session');

    const post = async () => {
      const instance = await getInstance();

      if (!instance) {
        commitSession({ id, sessionId });
      }
    };

    if (!!sessionId) {
      post();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commitSession, id]);

  const run = async () => {
    console.log('running');

    const instance = await getInstance();

    if (instance) {
      console.log('testing');
      await testIntegration({ id, tenantId: STATIC_TENANT_ID });
    } else {
      console.log('createSesssion');
      await createSesssion({ id, tenantId: STATIC_TENANT_ID });
    }
  };

  return {
    run,
  };
};

export default useRunner;
