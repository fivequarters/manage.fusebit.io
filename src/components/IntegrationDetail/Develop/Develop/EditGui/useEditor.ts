import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getAllInstances } from '../../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { useAccountIntegrationCreateSession } from '../../../../../hooks/api/v2/account/integration/session/useCreateOne';
import { useAccountIntegrationCommitSession } from '../../../../../hooks/api/v2/account/integration/session/useCommitOne';
import { useAccountIntegrationTestIntegration } from '../../../../../hooks/api/v2/account/integration/useTestOne';
import { useAxios } from '../../../../../hooks/useAxios';
import { useContext } from '../../../../../hooks/useContext';
import { Install } from '../../../../../interfaces/install';
import { trackEvent } from '../../../../../utils/analytics';

export const STATIC_TENANT_ID = 'user-1';

const useEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { axios } = useAxios();
  const { mutateAsync: createSesssion } = useAccountIntegrationCreateSession();
  const { mutateAsync: testIntegration } = useAccountIntegrationTestIntegration();
  const { mutateAsync: commitSession } = useAccountIntegrationCommitSession();

  const findInstance = useCallback(async () => {
    const {
      data: { items },
    } = await getAllInstances<Install>(
      axios,
      {
        subscriptionId: userData.subscriptionId,
        accountId: userData.accountId,
        id,
      },
      {
        tag: `fusebit.tenantId=${STATIC_TENANT_ID}`,
      }
    );

    return (items || [])[0];
  }, [axios, id, userData]);

  useEffect(() => {
    const prevSessionId = localStorage.getItem('session');

    const handleChangeStorage = () => {
      const sessionId = localStorage.getItem('session');

      const runFirstTest = async () => {
        try {
          const hasInstance = await findInstance();

          if (!hasInstance) {
            await commitSession({ id, sessionId });

            await testIntegration({ id, tenantId: STATIC_TENANT_ID });
          }
        } catch (error) {
          console.log(error);
        }
      };

      if (prevSessionId !== sessionId) {
        runFirstTest()
      }
    }

    window.addEventListener('storage', handleChangeStorage)

    return () => {
      window.removeEventListener('storage', handleChangeStorage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleRun = async () => {
    trackEvent('Run Button Clicked', 'Web Editor');
    try {

      if (window.editor.dirtyState) {
        await window.editor._server.saveFunction(window.editor)
      }

      const hasInstance = await findInstance();

      if (hasInstance) {
        await testIntegration({ id, tenantId: STATIC_TENANT_ID });
      } else {
        await createSesssion({ id, tenantId: STATIC_TENANT_ID });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleRun,
  };
};

export default useEditor;
