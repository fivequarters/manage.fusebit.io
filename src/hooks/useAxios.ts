import axios, { AxiosRequestConfig } from "axios";
import { useContext } from "./useContext";

interface ApiResponse<T> {
  error?: string;
  data: T;
  success?: boolean;
}

export const useAxios = () => {
  const BASE_URL = `https://stage.us-west-2.fusebit.io`;
  const { userData } = useContext();

  const _axios = async <T extends {}>(
    endpoint: string,
    method: "post" | "delete" | "put" | "get",
    params: any = {},
    headers: any = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: `${BASE_URL}${endpoint}`,
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
    axios: _axios
  }
}