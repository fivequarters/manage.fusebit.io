import axios, { AxiosRequestConfig } from 'axios';
import { readLocalData, useContext } from './useContext';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

interface ApiResponse<T> {
  error?: string;
  data: T;
  success?: boolean;
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = Number(error.response.status);
    if (statusCode === 404) {
      const __userData = readLocalData();
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

  const _axios = async <T extends {}>(
    endpoint: string,
    method: 'post' | 'delete' | 'put' | 'get' | 'patch',
    params: any = {},
    headers: any = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: `${REACT_APP_FUSEBIT_DEPLOYMENT}${endpoint}`,
        data: params,
        headers,
      };
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
      const response = await axios(config);
      return { success: true, data: response.data as T };
    } catch (e) {
      return { success: false, error: e.message, data: e.response && e.response.data };
    }
  };

  return {
    axios: _axios,
  };
};
