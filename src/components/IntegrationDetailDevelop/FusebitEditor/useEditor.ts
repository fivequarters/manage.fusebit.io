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
import { useError } from '@hooks/useError';
import { storeIntegrationConfig, getIntegrationConfig, resetIntegrationConfig } from '@utils/localStorage';
import { InnerConnector, Integration } from '@interfaces/integration';
import useEditorEvents from './useEditorEvents';

interface Props {
  integrationData?: ApiResponse<Integration>;
  enableListener?: boolean;
  isMounted?: boolean;
  onReadyToRun?: () => void;
  onReadyToLogin?: () => void;
  onMissingIdentities?: (connectors?: InnerConnector[]) => void;
}

const LOCALSTORAGE_SESSION_KEY = 'session';

const useEditor = (
  {
    integrationData,
    enableListener = true,
    isMounted = false,
    onReadyToRun,
    onReadyToLogin,
    onMissingIdentities,
  } = {} as Props
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
  const { isSaving, errorBuild, setErrorBuild } = useEditorEvents({ isMounted });
  const { createError } = useError();
  const tenantId = getTenantId();
  const integrationConfig = getIntegrationConfig(id, tenantId);

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

        try {
          await commitSession({ id, sessionId: e.newValue });

          await testIntegration({ id, tenantId: getTenantId() });

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
  }, [enableListener, integrationData, runPending]);

  const handleMissingOrIncompleteInstall = useCallback(
    async (connectorsWithoutIdentity: string[], install?: Install) => {
      console.log('HANDLE MISSING OR INCOMPLETE INSTALL', connectorsWithoutIdentity, install);
      const res = await createSesssion({
        id,
        tenantId: getTenantId(),
        install,
        components: connectorsWithoutIdentity.length && connectorsWithoutIdentity,
      });

      storeIntegrationConfig(id, { session: { url: res.data.targetUrl } });
    },
    [createSesssion, getTenantId, id, integrationData]
  );

  const handleLogin = useCallback(() => {
    console.log('HANDLE LOGIN', integrationConfig, integrationConfig.session?.url);
    window.open(integrationConfig.session?.url); // ?.focus();
    resetIntegrationConfig(id, tenantId);
  }, [id, integrationConfig.session?.url, tenantId]);

  const handleRun = useCallback(async () => {
    trackEvent('Run Button Clicked', 'Web Editor');

    try {
      const url = integrationConfig.session?.url;

      console.log('HANDLE RUN', url, !!onReadyToLogin, id, getTenantId(), integrationConfig, runPending);

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
  }, [getTenantId, id, integrationConfig.session?.url]);

  const handleEdit = useCallback(async () => {
    console.log('HANDLE EDIT', integrationData, !!onMissingIdentities);
    trackEvent('Develop Edit Web Button Clicked', 'Integration');
    try {
      const install = await findInstall();

      // Determine connectors that do not have an identity defined as part of the install
      const connectorsWithoutIdentity: InnerConnector[] = [];
      if (install) {
        (integrationData?.data.data.components || []).forEach((component) => {
          if (component.entityType === 'connector' && !install.data[component.name]) {
            connectorsWithoutIdentity.push(component);
          }
        });
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
  }, [
    findInstall,
    handleMissingOrIncompleteInstall,
    handleRun,
    integrationData?.data.data.components,
    onMissingIdentities,
    onReadyToRun,
    runPending,
  ]);

  useEffect(() => {
    if (needsInitialization && integrationData) {
      setNeedsInitialization(false);
      handleEdit();
    }
  }, [needsInitialization, integrationData, handleEdit]);

  useEffect(() => {
    if (errorBuild) {
      createError({ message: errorBuild });
      setErrorBuild('');
    }
  }, [errorBuild, createError, setErrorBuild]);

  return {
    handleRun,
    handleNoInstallFound: handleMissingOrIncompleteInstall,
    isFindingInstall,
    isCreatingSession,
    isTesting,
    isCommiting,
    isSaving,
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
