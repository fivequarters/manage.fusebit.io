import axios, { AxiosRequestConfig } from 'axios';
import { X_USER_AGENT } from '../utils/constants';
import { readLocalData, validateToken } from '../utils/utils';
import { useContext } from './useContext';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export interface ApiResponse<T> {
  error?: string;
  data: T;
  success?: boolean;
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
    const statusCode = Number(error.response.status);
    const __userData = readLocalData();
    if (statusCode === 403) {
      validateToken();
    } else if (statusCode === 404) {
      let toUrl = '/logged-out';
      if (__userData.token) {
        if (window.location.href.indexOf('connector') >= 0) toUrl = '/connectors';
        else if (window.location.href.indexOf('integration') >= 0) toUrl = '/';
        else toUrl = '/';
      }
      window.location.href = toUrl;
    }
    return Promise.reject(error);
  }
);

export const useAxios = () => {
  const { userData } = useContext();

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

    const response = await axios(config);
    return { success: true, data: response.data as T };
  };

  return {
    axios: _axios,
  };
};
