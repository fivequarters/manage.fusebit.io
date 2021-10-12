import { Client } from '../interfaces/client';
import { KeyPair } from '../interfaces/keyPair';
import { Issuer } from '../interfaces/issuer';
import { TokenPayload } from '../interfaces/tokenPayload';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export function generateNonExpiringToken(keyPair: KeyPair, client: Client, issuer: Issuer): Promise<string> {
  const tokenPayload = {
    sub: client.id,
    aud: REACT_APP_FUSEBIT_DEPLOYMENT as string,
  };
  return signJwt(tokenPayload, issuer, keyPair.privateKey);
}

export async function signJwt(
  tokenPayload: TokenPayload,
  issuer: Issuer,
  privateKey: CryptoKey,
  algorithmOptions: Record<string, string> = {}
): Promise<string> {
  const header = {
    alg: algorithmOptions.algorithm || 'RS256',
    typ: 'JWT',
    kid: issuer.publicKeys[0].keyId,
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
      name: algorithmOptions.name || 'RSASSA-PKCS1-v1_5',
      hash: algorithmOptions.hash || 'SHA-256',
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
