import { useLoader } from './useLoader';
import { useError } from './useError';
import { useContext } from './useContext';
import { getBackendClients, createBackendClient, removedBackendClient } from '../utils/backendClients';

export const useBackendClient = () => {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  const registerBackend = async () => {
    try {
      createLoader();
      const nonExpiringToken = await createBackendClient(userData);
      console.log(nonExpiringToken);
      removeLoader();
      return nonExpiringToken;
    } catch (e) {
      createError(e);
    } finally {
      removeLoader();
    }
  };

  const removeBackendClientListener = async (backendClientId: string) => {
    try {
      createLoader();
      await removedBackendClient(userData, backendClientId);
    } catch (e) {
      createError(e);
    } finally {
      removeLoader();
    }
  };

  const getBackendClientListener = async () => {
    try {
      const backendClients = await getBackendClients(userData);
      return backendClients;
    } catch (e) {
      createError(e);
    }
  };

  return {
    registerBackend,
    removeBackendClientListener,
    getBackendClientListener,
  };
};
