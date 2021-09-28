import { ServerResponse } from 'http';

export interface Context {
  boundaryId: string;
  dirtyState: { [key: string]: any };
  functionId: string;
  listeners: { [key: string]: any };
  metadata: { [key: string]: any };
  readOnly: boolean;
  selectedFileName: string;
  specification: { [key: string]: any };
  _monaco: { [key: string]: any };
  _server: {
    saveFunction: (Context: Context) => void;
    runFunction: (Context: Context) => Promise<ServerResponse>;
    [key: string]: any;
  };
  startRun: (url: string) => void
  finishRun: (error?: string, res?: Record<string, any> & { text: string }) => void
}
