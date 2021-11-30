export interface LogEntry {
  data: string;
  name: string;
}

export interface LogData {
  msg: string;
  level: number;
}

export interface LogEntryError {
  error: string;
  name: string;
}

export interface LogError {
  message: string;
  name: string;
  config: {
    url: string;
    method: string;
    data: string;
    headers: {
      Accept: string;
      'Content-Type': string;
      'X-User-Agent': string;
      Authorization: string;
    };
    params: object;
    transformRequest: any[];
    transformResponse: any[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    transitional: {
      silentJSONParsing: boolean;
      forcedJSONParsing: boolean;
      clarifyTimeoutError: boolean;
    };
  };
}
