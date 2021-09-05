import { EntityState, OperationState, OperationStatus } from '../interfaces/operation';
import { useAxios } from './useAxios';
import { useContext } from './useContext';

const css = `position: fixed;top: 0;left: 0;height: 100vh;width: 100%;background: rgba(255,255,255,.8);display: flex;align-items: center;justify-content: center;z-index: 9999;`;
const settingUpCss = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50px);
    font-size: 22px;
    line-height: 18px;
    color: #333333;
    font-weight: 700;
    z-index: 99999;
    `;
export const useLoader = () => {
  const { axios } = useAxios();
  const { userData } = useContext();

  const removeLoader = () => {
    const loader = document.getElementById('loader');
    const loaderTitle = document.getElementById('loaderTitle');
    if (loader) loader.remove();
    if (loaderTitle) {
      loaderTitle.remove();
      localStorage.removeItem('loaderText');
    }
  };

  const createLoader = () => {
    const loaderExists = !!document.getElementById('loader');
    if (loaderExists) return;
    const loader = document.createElement('div');
    loader.setAttribute('id', 'loader');
    loader.setAttribute('style', css);
    loader.innerHTML = '<img src="/loader.svg" width="100" height="100">';
    document.body.appendChild(loader);
    const loaderText = localStorage.getItem('loaderText');
    if (loaderText !== null) {
      const title = document.createElement('div');
      title.setAttribute('id', 'loaderTitle');
      title.setAttribute('style', settingUpCss);
      title.innerHTML = loaderText;
      document.body.appendChild(title);
    }
  };

  const waitForEntityStateChange = async (entityType: string, entityIds: string[]) => {
    const promises = entityIds.map((entityId: string) => {
      return new Promise(async (accept: Function, reject: Function) => {
        if (!entityId) {
          return accept({});
        }
        let lastResponse;
        while (!lastResponse || lastResponse.data.operationState.status === OperationStatus.processing) {
          try {
            lastResponse = await axios<EntityState>(
              `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/${entityType}/${entityId}`,
              'get'
            );
          } catch (err) {
            reject(err);
          }
        }
        const { operationState } = lastResponse.data;
        if (operationState.status === OperationStatus.success) {
          accept({});
        } else {
          const detailedError = operationState.errorCode
            ? `${operationState.errorCode}: ${operationState.errorDetails}`
            : '';
          reject({
            message: `Failed to create entity. ${detailedError}`,
          });
        }
      });
    });
    return Promise.all(promises);
  };

  return {
    createLoader,
    waitForEntityStateChange,
    removeLoader,
  };
};
