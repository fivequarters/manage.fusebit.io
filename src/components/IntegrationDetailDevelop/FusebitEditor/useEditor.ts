import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getAllInstalls } from '@hooks/api/v2/account/integration/install/useGetAll';
import { useAccountIntegrationCreateSession } from '@hooks/api/v2/account/integration/session/useCreateOne';
import { useAccountIntegrationCommitSession } from '@hooks/api/v2/account/integration/session/useCommitOne';
import { useAccountIntegrationTestIntegration } from '@hooks/api/v2/account/integration/useTestOne';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { InstallList } from '@interfaces/install';
import { trackEvent } from '@utils/analytics';
import { STATIC_TENANT_ID } from '@utils/constants';
import { useError } from '@hooks/useError';
import { storeIntegrationInfo, getIntegrationConfig, resetIntegrationInfo } from '@utils/localStorage';
import useEditorEvents from './useEditorEvents';

interface Props {
  enableListener?: boolean;
  isMounted?: boolean;
  onReadyToRun?: () => void;
  onReadyToLogin?: () => void;
}

const LOCALSTORAGE_SESSION_KEY = 'session';

const useEditor = ({ enableListener = true, isMounted = false, onReadyToRun, onReadyToLogin } = {} as Props) => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { mutateAsync: createSesssion, isLoading: isCreatingSession } = useAccountIntegrationCreateSession();
  const { mutateAsync: testIntegration, isLoading: isTesting } = useAccountIntegrationTestIntegration();
  const { mutateAsync: commitSession, isLoading: isCommiting } = useAccountIntegrationCommitSession();
  const [isFindingInstall, setIsFindingInstall] = useState(false);
  // Prevent beign called multiple times if user has multiple tabs open
  const hasSessionChanged = useRef(false);
  const { isSaving, errorBuild, setErrorBuild, logs, setLogs } = useEditorEvents({ isMounted });
  const { createError } = useError();

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

  const handleNoInstallFound = async () => {
    const res = await createSesssion({ id, tenantId: STATIC_TENANT_ID });

    storeIntegrationInfo(id, { session: { url: res.data.targetUrl } });
  };

  const handleLogin = () => {
    window.open(getIntegrationConfig(id).session?.url);
    resetIntegrationInfo(id);
  };

  const handleEdit = async () => {
    trackEvent('Develop Edit Web Button Clicked', 'Integration');
    try {
      const hasInstall = await findInstall();

      if (hasInstall) {
        onReadyToRun?.();
      } else {
        await handleNoInstallFound();
        onReadyToRun?.();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleRun = async () => {
    trackEvent('Run Button Clicked', 'Web Editor');

    try {
      const config = getIntegrationConfig(id);

      if (config.session?.url) {
        if (onReadyToLogin) {
          onReadyToLogin();
        } else {
          handleLogin();
        }
      } else {
        await testIntegration({ id, tenantId: STATIC_TENANT_ID });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    if (errorBuild) {
      createError({ message: 'The build failed' });
      setErrorBuild('');
    }
  }, [errorBuild, createError, setErrorBuild]);

  return {
    handleRun,
    handleNoInstallFound,
    isFindingInstall,
    isCreatingSession,
    isTesting,
    isCommiting,
    isSaving,
    handleEdit,
    handleLogin,
    isRunning: isTesting || isCommiting,
    isEditing: isFindingInstall || isCreatingSession,
    logs,
    setLogs,
  };
};

export default useEditor;
