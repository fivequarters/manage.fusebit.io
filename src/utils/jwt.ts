import { KeyPair } from "./crypto";

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

type Issuer = {
  displayName: string;
  id: string;
  keyId: string;
};

type TokenPayload = {
  sub: string;
  aud: string;
  [key: string]: any;
};

export function generateNonExpiringToken(keyPair: KeyPair, issuer: any, sub: string) {
  const tokenPayload = {
    sub,
    aud: REACT_APP_FUSEBIT_DEPLOYMENT as string,
  };
  return signJwt(tokenPayload, issuer, keyPair.privateKey);
}

export async function signJwt(tokenPayload: TokenPayload, issuer: Issuer, privateKey: CryptoKey): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: issuer.keyId,
  };

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const neverEndingExpInSeconds = 9999999999;

  const payload: TokenPayload = {
    iss: issuer.id,
    iat: nowInSeconds,
    exp: neverEndingExpInSeconds,
    ...tokenPayload,
  };

  const stringifiedHeader = JSON.stringify(header);
  const stringifiedPayload = JSON.stringify(payload);

  const headerBase64 = uint8ArrayToString(stringToUint8Array(stringifiedHeader));
  const payloadBase64 = uint8ArrayToString(stringToUint8Array(stringifiedPayload));
  const headerAndPayload = `${headerBase64}.${payloadBase64}`;

  const messageAsUint8Array = stringToUint8Array(headerAndPayload);

  const signature = await crypto.subtle.sign(
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    privateKey,
    messageAsUint8Array
  );

  const base64Signature = uint8ArrayToString(new Uint8Array(signature));

  return headerAndPayload + '.' + base64Signature;
}

function uint8ArrayToString(unsignedArray: Uint8Array): string {
  const base64string = btoa(String.fromCharCode(...unsignedArray));
  return base64string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64ToUint8Array(base64Contents: string): Uint8Array {
  base64Contents = base64Contents.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const content = atob(base64Contents);
  return new Uint8Array(content.split('').map((c) => c.charCodeAt(0)));
}

function stringToUint8Array(contents: string): Uint8Array {
  const encoded = btoa(unescape(encodeURIComponent(contents)));
  return base64ToUint8Array(encoded);
}
