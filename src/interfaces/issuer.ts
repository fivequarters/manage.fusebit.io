export interface Issuer {
  displayName: string;
  id: string;
  publicKeys: {
    keyId: string;
    publicKey: string;
  }[];
}
