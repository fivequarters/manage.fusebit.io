export interface BackendClient {
  id: string;
  name?: string;
  issuer: string;
  token?: string;
  tokenSignature: string;
}
