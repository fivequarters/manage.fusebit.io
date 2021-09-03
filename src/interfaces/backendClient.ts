export interface BackendClient {
  id: string;
  issuer: string;
  token?: string;
  tokenSignature: string;
}
