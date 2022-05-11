import { FC, ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { getAnalyticsClient, trackAuthEvent } from '@utils/analytics';
import { createAxiosClient } from '@utils/utils';
import { Auth0Token, FusebitProfileEx } from '@interfaces/auth0Token';
import { AuthStatus, signIn, useAuthContext } from '@hooks/useAuthContext';
import useFirstTimeVisitor from '@hooks/useFirstTimeVisitor';
import { Auth0Profile } from '@interfaces/auth0Profile';
import { Company } from '@interfaces/company';
import { User } from '@interfaces/user';

const {
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_FUSEBIT_DEPLOYMENT,
  REACT_APP_FUSEBIT_USER_ID,
  REACT_APP_FUSEBIT_ACCOUNT_ID,
  REACT_APP_FUSEBIT_SUBSCRIPTION_ID,
} = process.env;

const getAuth0ProfileAndCompany = async (auth0Token: string, accountId: string) => {
  let auth0Profile = {} as Auth0Profile;
  let company = {} as Company;
  const skipXUserAgent = true;
  const auth0AxiosClient = createAxiosClient(auth0Token, skipXUserAgent);
  const { data: userInfo } = await auth0AxiosClient.get(`${REACT_APP_AUTH0_DOMAIN}/userinfo`);
  auth0Profile = userInfo;
  const fusebitAxiosClient = createAxiosClient(auth0Token);
  const { data: account } = await fusebitAxiosClient.get(`${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}`);
  company = account;

  return {
    auth0Profile,
    company,
  };
};

const redeemInitToken = async (accessToken: string, fusebitProfileEx: FusebitProfileEx, initToken: string) => {
  const skipXUserAgent = true;
  const client = createAxiosClient(undefined, skipXUserAgent);
  const { data } = await client.post(`${fusebitProfileEx.fusebitProvisionUrl}/init`, {
    initToken,
    accessToken,
  });
  return data;
};

const AuthCallbackPage: FC<{}> = (): ReactElement => {
  const location = useLocation();
  const history = useHistory();
  const { setAuthStatus, setUserData } = useAuthContext();
  const { setFirstTimeVisitor } = useFirstTimeVisitor();

  const handleError = (error: any) => {
    history.push(`/logged-out?error=${error}`);
  };

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(location.hash.substring(1));
      const error = urlParams.get('error');
      const token = urlParams.get('access_token') || undefined;

      if (error || !token) {
        if (error && error !== 'login_required') {
          const err =
            'This initialization token is no longer valid.  Please request a new url from an authorized Fusebit User.';
          handleError(err);
        }
        signIn();
        return;
      }

      const decoded = jwt_decode<Auth0Token>(token);
      const fusebitProfile = decoded['https://fusebit.io/profile'];
      const isSignUpEvent = decoded['https://fusebit.io/new-user'] === true;

      const initToken = window.localStorage.getItem('fusebitInitToken');
      if (initToken) {
        // This is completion of the invitation transaction. Call the provisioning function to
        // redeem the init token, then redirect back to the home page to re-authenticate and
        // get a new access token with an updated Fusebit profile.
        window.localStorage.removeItem('fusebitInitToken');
        redeemInitToken(token, fusebitProfile, initToken)
          .then(() => {
            history.push('/');
          })
          .catch((err) => {
            handleError(err);
          });
        return;
      }

      getAuth0ProfileAndCompany(token, fusebitProfile?.accountId || '')
        .then(({ auth0Profile, company }) => {
          const normalizedData = {
            firstName: auth0Profile?.given_name || '',
            lastName: auth0Profile?.family_name || '',
            company: company?.displayName || '',
          };

          // for local testing: https://docs.google.com/document/d/1dkI4UdRgaD840HWc-sGi6_qz4JY8AHts97MD-1O4SpY/edit#heading=h.gtoda0wgke4n
          if (REACT_APP_FUSEBIT_ACCOUNT_ID && REACT_APP_FUSEBIT_SUBSCRIPTION_ID && REACT_APP_FUSEBIT_USER_ID) {
            fusebitProfile.accountId = REACT_APP_FUSEBIT_ACCOUNT_ID;
            fusebitProfile.subscriptionId = REACT_APP_FUSEBIT_SUBSCRIPTION_ID;
            fusebitProfile.userId = REACT_APP_FUSEBIT_USER_ID;
          }

          setUserData({ token, ...fusebitProfile, ...auth0Profile, ...company, ...normalizedData });
          setAuthStatus(AuthStatus.AUTHENTICATED);

          const navigatePostAuth = () => {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const requestedPath = (urlSearchParams.get('requestedPath') || '/').replace(/ /g, '+');
            const requestedSearch = localStorage.getItem('requestedSearch') || '';
            const requestedHash = localStorage.getItem('requestedHash') || '';

            setFirstTimeVisitor(true);
            localStorage.removeItem('requestedSearch');
            localStorage.removeItem('requestedHash');
            history.push(requestedPath + requestedSearch + requestedHash);
          };

          const user: User = { email: fusebitProfile?.email, ...auth0Profile, ...company };
          const issuedByAuth0 = decoded.iss.startsWith(process.env.REACT_APP_AUTH0_DOMAIN as string);
          getAnalyticsClient(user, issuedByAuth0);
          trackAuthEvent(user, fusebitProfile, isSignUpEvent, navigatePostAuth);
        })
        .catch((err) => {
          handleError(err);
        });
    } catch (err) {
      handleError(err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default AuthCallbackPage;
