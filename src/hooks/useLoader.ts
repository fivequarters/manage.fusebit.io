import { Operation } from '../interfaces/operation';
import { useAxios } from './useAxios';
import { useContext } from './useContext';

const css = `position: fixed;top: 0;left: 0;height: 100vh;width: 100%;background: rgba(255,255,255,.8);display: flex;align-items: center;justify-content: center;z-index: 9999;`;

export const useLoader = () => {
  const { axios } = useAxios();
  const { userData } = useContext();

  const removeLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
  };

  const createLoader = () => {
    const loader = document.createElement('div');
    loader.setAttribute('id', 'loader');
    loader.setAttribute('style', css);
    loader.innerHTML = '<img src="/loader.svg" width="100" height="100">';
    document.body.appendChild(loader);
  };

  const waitForOperations = async (operationIds: string[]) => {
    const intervalIds: { [key: string]: number } = {};
    const promises = operationIds.map((operationId: string) => {
      return new Promise((accept: Function, reject: Function) => {
        intervalIds[operationId] = Number(
          setInterval(() => {
            if (!operationId) {
              return accept({});
            }
            axios<Operation>(
              `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/operation/${operationId}`,
              'get'
            )
              .then((response) => {
                if (response.data.statusCode !== 202) {
                  accept({});
                }
              })
              .catch((e: any) => {
                reject(e);
              });
          }, 1000)
        );
      });
    });
    return new Promise((globalAccept: Function, globalReject: Function) => {
      Promise.all(promises)
        .then((_) => {
          Object.keys(intervalIds).forEach((operationId: string) => clearInterval(intervalIds[operationId]));
          globalAccept({});
        })
        .catch((e: any) => {
          Object.keys(intervalIds).forEach((operationId: string) => clearInterval(intervalIds[operationId]));
          globalReject(e);
        });
    });
  };

  return {
    createLoader,
    waitForOperations,
    removeLoader,
  };
};
