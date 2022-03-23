import { User } from '@interfaces/user';
import { signJwt } from './jwt';

const { REACT_APP_FUSEBIT_DEPLOYMENT, REACT_APP_SAMPLE_APP_URL, REACT_APP_SAMPLE_APP_KEY } = process.env;

export async function createSampleAppClientUrl(
  user: User,
  enabledIntegrations?: Record<string, string>
): Promise<string> {
  const { accountId, subscriptionId, token } = user;
  const url = new URL(`${REACT_APP_SAMPLE_APP_URL}`);

  const configuration = {
    ...enabledIntegrations,
    FUSEBIT_BASE_URL: `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2/account/${accountId}/subscription/${subscriptionId}`,
    FUSEBIT_JWT: token,
  };

  const hmacKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(REACT_APP_SAMPLE_APP_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Create a JWT that'll act as an envelope for the sample app
  const sampleAppJwt = await signJwt(
    { sub: `${user.id}`, aud: `${REACT_APP_SAMPLE_APP_URL}`, ...configuration },
    { displayName: 'Sample App Key', id: `${user.id}-issuer`, publicKeys: [{ keyId: 'sample', publicKey: 'sample' }] },
    hmacKey,
    { name: 'HMAC', hash: 'SHA-256', algorithm: 'HS256' }
  );

  // Add it to the URL, and return
  url.hash = `configuration=${sampleAppJwt}`;
  return url.toString();
}
