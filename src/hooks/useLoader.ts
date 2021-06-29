import { useState } from 'react';
import { Operation } from '../interfaces/operation';
import { useAxios } from './useAxios';
import { useContext } from './useContext';

const css = `position: fixed;top: 0;left: 0;height: 100vh;width: 100%;background: rgba(255,255,255,.8);display: flex;align-items: center;justify-content: center;z-index: 99;`;

export const  useLoader = () => {
    const { axios } = useAxios();
    const { userData } = useContext();

    const removeLoader = () => {
        const loader = document.getElementById('loader');
        if (loader) loader.remove();
    }

    const createLoader = () => {
        const loader = document.createElement("div");
        loader.setAttribute('id', 'loader');
        loader.setAttribute('style', css);
        loader.innerHTML = '<img src="/loader.svg" width="100" height="100">';
        document.body.appendChild(loader);
    }

    const waitForOperation = async (operationId: string) => {
        return new Promise((accept: Function) => {
            removeLoader();
            createLoader();
            const intervalId = setInterval(() => {
                axios<Operation>(`/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/operation/${operationId}`, 'get').then(response => {
                    if (response.data.code === 200) {
                        clearInterval(intervalId);
                        removeLoader();
                        accept({});
                    }
                });
            }, 1000);
        })
    }

    return {
        waitForOperation
    };
};