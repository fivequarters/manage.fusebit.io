interface IdentityInstance {
  id: string;
  data: object;
  tags: object;
  version: string;
  expires: string;
}

export interface Identity {
  items: IdentityInstance[];
  total: number;
  next: string;
}
