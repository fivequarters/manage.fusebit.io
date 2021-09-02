export interface TokenPayload {
  sub: string;
  aud: string;
  [key: string]: any;
}
