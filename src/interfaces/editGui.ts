export interface Context {
  boundaryId: string;
  dirtyState: boolean;
  functionId: string;
  listeners: object;
  metadata: object;
  readOnly: boolean;
  selectedFileName: string;
  specification: object;
  _monaco: object;
  _server: object;
}
