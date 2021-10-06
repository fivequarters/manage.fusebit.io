import { useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllInstances } from '../../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { useAccountIntegrationCreateSession } from '../../../../../hooks/api/v2/account/integration/session/useCreateOne';
import { useAccountIntegrationCommitSession } from '../../../../../hooks/api/v2/account/integration/session/useCommitOne';
import { useAccountIntegrationTestIntegration } from '../../../../../hooks/api/v2/account/integration/useTestOne';
import { useAxios } from '../../../../../hooks/useAxios';
import { useContext } from '../../../../../hooks/useContext';
import { Install } from '../../../../../interfaces/install';
import { trackEvent } from '../../../../../utils/analytics';
import { STATIC_TENANT_ID } from '../../../../../utils/constants';

interface Props {
  onNoInstanceFound?: () => void;
}

const useEditor = ({ onNoInstanceFound } = {} as Props) => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { axios } = useAxios();
  const { mutateAsync: createSesssion, isLoading: isCreatingSession } = useAccountIntegrationCreateSession();
  const { mutateAsync: testIntegration, isLoading: isTesting } = useAccountIntegrationTestIntegration();
  const { mutateAsync: commitSession, isLoading: isCommiting } = useAccountIntegrationCommitSession();
  const [isFindingInstance, setIsFindingInstance] = useState(false);

  const findInstance = useCallback(async () => {
    try {
      setIsFindingInstance(true);

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
    } finally {
      setIsFindingInstance(false);
    }
  }, [axios, id, userData]);

  useEffect(() => {
    const prevSessionId = localStorage.getItem('session');

    const handleChangeStorage = () => {
      const sessionId = localStorage.getItem('session');

      const runFirstTest = async () => {
        try {
          await commitSession({ id, sessionId });

          await testIntegration({ id, tenantId: STATIC_TENANT_ID });

          trackEvent('Run Button Execution', 'Web Editor', { runStatus: "success" });
        } catch (error) {
          trackEvent('Run Button Execution', 'Web Editor', { runStatus: "failure" });
          console.log(error);
        }
      };

      if (prevSessionId !== sessionId) {
        runFirstTest();
      }
    };

    window.addEventListener('storage', handleChangeStorage);

    return () => {
      window.removeEventListener('storage', handleChangeStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNoInstanceFound = () => createSesssion({ id, tenantId: STATIC_TENANT_ID });

  const handleRun = async () => {
    trackEvent('Run Button Clicked', 'Web Editor');
    try {
      if (window.editor && window.editor.dirtyState) {
        await window.editor._server.saveFunction(window.editor);
      }

      const hasInstance = await findInstance();

      if (hasInstance) {
        await testIntegration({ id, tenantId: STATIC_TENANT_ID });
      } else {
        if (onNoInstanceFound) {
          onNoInstanceFound();
        } else {
          await handleNoInstanceFound();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleRun,
    handleNoInstanceFound,
    isFindingInstance,
    isCreatingSession,
    isTesting,
    isCommiting,
    isRunning: isFindingInstance || isCreatingSession || isTesting || isCommiting,
  };
};

export default useEditor;
