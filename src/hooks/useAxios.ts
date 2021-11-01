import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { X_USER_AGENT } from '@utils/constants';
import { signIn, useAuthContext } from './useAuthContext';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export interface ApiResponse<T> {
  error?: string;
  data: T;
  success?: boolean;
  fullResponse: AxiosResponse<T>;
}

export type FusebitAxios = <T extends {}>(
  endpoint: string,
  method: 'post' | 'delete' | 'put' | 'get' | 'patch',
  params?: any,
  headers?: any,
  queryParams?: Record<string, any>
) => Promise<ApiResponse<T>>;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = Number(error?.response?.status);
    if (statusCode === 403) {
      const silent = true;
      signIn(silent);
    } else if (statusCode === 404) {
      // TODO add "not found message/error"
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const useAxios = ({ ignoreInterceptors } = {} as { ignoreInterceptors?: boolean }) => {
  const { userData } = useAuthContext();

  const _axios: FusebitAxios = async <T extends {}>(
    endpoint: string,
    method: 'post' | 'delete' | 'put' | 'get' | 'patch',
    params: any = {},
    headers: any = {},
    queryParams = {}
  ) => {
    const config: AxiosRequestConfig = {
      method,
      url: `${REACT_APP_FUSEBIT_DEPLOYMENT}${endpoint}`,
      data: params,
      headers: {
        ...headers,
        'X-User-Agent': X_USER_AGENT,
      },
      params: queryParams,
    };

    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }

    let response;

    if (ignoreInterceptors) {
      response = await axios.create()(config);
    } else {
      response = await axios(config);
    }

    return { success: true, data: response.data as T, fullResponse: response };
  };

  return {
    axios: _axios,
  };
};
