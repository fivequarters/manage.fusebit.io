import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getAllInstalls } from '../../../hooks/api/v2/account/integration/install/useGetAll';
import { useAccountIntegrationCreateSession } from '../../../hooks/api/v2/account/integration/session/useCreateOne';
import { useAccountIntegrationCommitSession } from '../../../hooks/api/v2/account/integration/session/useCommitOne';
import { useAccountIntegrationTestIntegration } from '../../../hooks/api/v2/account/integration/useTestOne';
import { useAxios } from '../../../hooks/useAxios';
import { useContext } from '../../../hooks/useContext';
import { InstallList } from '../../../interfaces/install';
import { trackEvent } from '../../../utils/analytics';
import { STATIC_TENANT_ID } from '../../../utils/constants';
import useIsSaving from './useIsSaving';

interface Props {
  onNoInstallFound?: () => void;
  enableListener?: boolean;
  isMounted?: boolean;
}

const LOCALSTORAGE_SESSION_KEY = 'session';

const useEditor = ({ onNoInstallFound, enableListener = true, isMounted = false } = {} as Props) => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { mutateAsync: createSesssion, isLoading: isCreatingSession } = useAccountIntegrationCreateSession();
  const { mutateAsync: testIntegration, isLoading: isTesting } = useAccountIntegrationTestIntegration();
  const { mutateAsync: commitSession, isLoading: isCommiting } = useAccountIntegrationCommitSession();
  const [isFindingInstall, setIsFindingInstall] = useState(false);
  // Prevent beign called multiple times if user has multiple tabs open
  const hasSessionChanged = useRef(false);
  const isSaving = useIsSaving({ isMounted });

  const findInstall = useCallback(async () => {
    try {
      setIsFindingInstall(true);

      const {
        data: { items },
      } = await getAllInstalls<InstallList>(
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
      setIsFindingInstall(false);
    }
  }, [axios, id, userData]);

  useEffect(() => {
    const handleChangeStorage = (e: any) => {
      const runFirstTest = async () => {
        hasSessionChanged.current = true;

        try {
          await commitSession({ id, sessionId: e.newValue });
          await testIntegration({ id, tenantId: STATIC_TENANT_ID });

          trackEvent('Run Button Execution', 'Web Editor', { runStatus: 'success' });
        } catch (error) {
          trackEvent('Run Button Execution', 'Web Editor', { runStatus: 'failure' });
          // eslint-disable-next-line no-console
          console.log(error);
        }
      };

      if (e.key === LOCALSTORAGE_SESSION_KEY && !hasSessionChanged.current) {
        runFirstTest();
      }
    };

    if (enableListener) {
      window.addEventListener('storage', handleChangeStorage);
    }

    return () => {
      if (enableListener) {
        window.removeEventListener('storage', handleChangeStorage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableListener]);

  const handleNoInstallFound = () => createSesssion({ id, tenantId: STATIC_TENANT_ID });

  const handleRun = async () => {
    trackEvent('Run Button Clicked', 'Web Editor');
    try {
      const hasInstall = await findInstall();

      if (window.editor?.dirtyState) {
        await window.editor._server.saveFunction(window.editor);
      }

      if (hasInstall) {
        await testIntegration({ id, tenantId: STATIC_TENANT_ID });
      } else if (onNoInstallFound) {
        onNoInstallFound();
      } else {
        await handleNoInstallFound();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return {
    handleRun,
    handleNoInstallFound,
    isFindingInstall,
    isCreatingSession,
    isTesting,
    isCommiting,
    isSaving,
    isRunning: isFindingInstall || isCreatingSession || isTesting || isCommiting,
  };
};

export default useEditor;
