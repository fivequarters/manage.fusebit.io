import { KeyPair } from '@interfaces/keyPair';

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  byteArray.forEach((byte) => {
    byteString += String.fromCharCode(byte);
  });
  return btoa(byteString);
}

function breakPemIntoMultipleLines(pem: string): string {
  const charsPerLine = 64;
  let pemContents = '';
  while (pem.length > 0) {
    pemContents += `${pem.substring(0, charsPerLine)}\n`;
    pem = pem.substring(64);
  }
  return pemContents;
}

function toPem(key: ArrayBuffer, type: 'private' | 'public'): string {
  const pemContents = breakPemIntoMultipleLines(arrayBufferToBase64(key));
  return `-----BEGIN ${type.toUpperCase()} KEY-----\n${pemContents}-----END ${type.toUpperCase()} KEY-----`;
}

export async function generateKeyPair(): Promise<KeyPair> {
  const generatedKeyPair: CryptoKeyPair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );

  const privateKeyBuffer: ArrayBuffer = await crypto.subtle.exportKey('pkcs8', generatedKeyPair.privateKey);
  const privateKeyPem = toPem(privateKeyBuffer, 'private');

  const exportedPublicKey: ArrayBuffer = await crypto.subtle.exportKey('spki', generatedKeyPair.publicKey);
  const publicKeyPem = toPem(exportedPublicKey, 'public');

  return {
    ...generatedKeyPair,
    publicKeyPem,
    privateKeyPem,
  };
}
