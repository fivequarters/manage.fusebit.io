export interface Client {
  id: string;
  displayName: string;
  name?: string;
  identities: {
    issuerId: string;
    subject: string;
  }[];
  access: {
    allow: { action: string; resource: string }[];
  };
}
