import axios, { AxiosRequestConfig } from "axios";
import { readLocalData, useContext } from "./useContext";

interface ApiResponse<T> {
  error?: string;
  data: T;
  success?: boolean;
}

export const INITIAL_API_URL = localStorage.getItem('FUSEBIT_API_BASE_URL') || `https://stage.us-west-2.fusebit.io`;

axios.interceptors.response.use(response => response, error => {
  const statusCode = Number(error.response.status);
  if (statusCode === 404) {
    const __userData = readLocalData();
    let toUrl = "/logged-out-error";
    if (__userData.token) {
      if (window.location.href.indexOf('connector') >= 0) toUrl = '/connectors';
      else if (window.location.href.indexOf('integration') >= 0) toUrl = '/';
      else toUrl = '/';
    }
    window.location.href = toUrl;
  }
  return Promise.reject(error);
});

export const useAxios = () => {
  const { userData } = useContext();

  const getBaseUrl = () => localStorage.getItem('FUSEBIT_API_BASE_URL') || `https://stage.us-west-2.fusebit.io`;

  const setBaseUrl = (value: string) => {
    localStorage.setItem('FUSEBIT_API_BASE_URL', value);
    window.location.reload();
  }

  const _axios = async <T extends {}>(
    endpoint: string,
    method: "post" | "delete" | "put" | "get",
    params: any = {},
    headers: any = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: `${getBaseUrl()}${endpoint}`,
        data: params,
        headers
      };
      if (userData.token) config.headers.Authorization = `Bearer ${userData.token}`;
      const response = await axios(config);
      return { success: true, data: response.data as T };
    } catch (e) {
      return { success: false, error: e.message, data: {} as T };
    }
  }

  return {
    axios: _axios,
    getBaseUrl,
    setBaseUrl
  }
}