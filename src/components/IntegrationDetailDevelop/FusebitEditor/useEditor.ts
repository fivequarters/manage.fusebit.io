import { useEffect, useCallback, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getAllInstalls } from '@hooks/api/v2/account/integration/install/useGetAll';
import { useAccountIntegrationCreateSession } from '@hooks/api/v2/account/integration/session/useCreateOne';
import { useAccountIntegrationCommitSession } from '@hooks/api/v2/account/integration/session/useCommitOne';
import { useAccountIntegrationTestIntegration } from '@hooks/api/v2/account/integration/useTestOne';
import { useAxios, ApiResponse } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { InstallList, Install } from '@interfaces/install';
import { trackEvent } from '@utils/analytics';
import { storeIntegrationConfig, getIntegrationConfig, resetIntegrationConfig } from '@utils/localStorage';
import { InnerConnector, Integration } from '@interfaces/integration';
import { useForkFeedUrl } from '@hooks/useForkFeedUrl';

interface Props {
  integrationData?: ApiResponse<Integration>;
  enableListener?: boolean;
  onReadyToRun?: () => void;
  onReadyToLogin?: () => void;
  onMissingIdentities?: (connectors?: InnerConnector[]) => void;
}

const LOCALSTORAGE_SESSION_KEY = 'session';

const useEditor = (
  { integrationData, enableListener = true, onReadyToRun, onReadyToLogin, onMissingIdentities } = {} as Props
) => {
  const { id } = useParams<{ id: string }>();
  const { userData, getTenantId } = useAuthContext();
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { mutateAsync: createSesssion, isLoading: isCreatingSession } = useAccountIntegrationCreateSession();
  const { mutateAsync: testIntegration, isLoading: isTesting } = useAccountIntegrationTestIntegration(id);
  const { mutateAsync: commitSession, isLoading: isCommiting } = useAccountIntegrationCommitSession();
  const [isFindingInstall, setIsFindingInstall] = useState(false);
  const [needsInitialization, setNeedsInitialization] = useState(true);
  const [runPending, setRunPending] = useState(false);
  // Prevent beign called multiple times if user has multiple tabs open
  const hasSessionChanged = useRef(false);
  const tenantId = getTenantId();
  const isForkEditor = useForkFeedUrl();

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
          tag: `fusebit.tenantId=${getTenantId()}`,
        }
      );

      return (items || [])[0];
    } finally {
      setIsFindingInstall(false);
    }
  }, [axios, id, userData, getTenantId]);

  useEffect(() => {
    const handleChangeStorage = (e: any) => {
      const runFirstTest = async () => {
        hasSessionChanged.current = true;
        const objectLocation = isForkEditor ? 'Web Editor (Read-Only)' : 'Web Editor';
        try {
          await commitSession({ id, sessionId: e.newValue });

          await testIntegration({ id, tenantId: getTenantId() });

          trackEvent('Run Button Execution', objectLocation, { runStatus: 'success' });
        } catch (error) {
          trackEvent('Run Button Execution', objectLocation, { runStatus: 'failure' });
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
  }, [enableListener, integrationData, runPending]);

  const handleMissingOrIncompleteInstall = async (connectorsWithoutIdentity: string[], install?: Install) => {
    const res = await createSesssion({
      id,
      tenantId: getTenantId(),
      install,
      components: connectorsWithoutIdentity.length && connectorsWithoutIdentity,
    });

    storeIntegrationConfig(id, { session: { url: res.data.targetUrl } });
  };

  const handleLogin = () => {
    const url = getIntegrationConfig(id, tenantId).session?.url;
    window.open(url);
    resetIntegrationConfig(id, tenantId);
  };

  const handleRun = async () => {
    const objectLocation = isForkEditor ? 'Web Editor (Read-Only)' : 'Web Editor';
    trackEvent('Run Button Clicked', objectLocation);

    try {
      const url = getIntegrationConfig(id, tenantId).session?.url;

      if (url) {
        if (onReadyToLogin) {
          onReadyToLogin();
        } else {
          handleLogin();
        }
      } else {
        await testIntegration({ id, tenantId: getTenantId() });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleEdit = async () => {
    trackEvent('Develop Edit Web Button Clicked', 'Integration');
    try {
      const install = await findInstall();

      // Determine connectors that do not have an identity defined as part of the install
      let connectorsWithoutIdentity: InnerConnector[] = [];
      if (install) {
        connectorsWithoutIdentity = (integrationData?.data.data.components || []).filter(
          (component) => component.entityType === 'connector' && !install.data[component.name]
        );
      }

      onMissingIdentities?.(install ? connectorsWithoutIdentity : undefined);

      const ready = () => {
        if (runPending) {
          setRunPending(false);
          handleRun();
        } else if (onReadyToRun) {
          onReadyToRun();
        }
      };

      if (install && connectorsWithoutIdentity.length === 0) {
        ready();
      } else {
        await handleMissingOrIncompleteInstall(
          connectorsWithoutIdentity.map((c) => c.name),
          install
        );
        ready();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    if (needsInitialization && integrationData) {
      setNeedsInitialization(false);
      handleEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsInitialization, integrationData]);

  return {
    handleRun,
    handleNoInstallFound: handleMissingOrIncompleteInstall,
    isFindingInstall,
    isCreatingSession,
    isTesting,
    isCommiting,
    handleEdit,
    handleLogin,
    isRunning: isTesting || isCommiting,
    isEditing: isFindingInstall || isCreatingSession,
    needsInitialization,
    setNeedsInitialization: (v: boolean) => {
      hasSessionChanged.current = false;
      setNeedsInitialization(v);
    },
    runPending,
    setRunPending,
  };
};

export default useEditor;
