import { FC, ReactElement, useEffect } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { getAnalyticsClient, isSegmentTrackingEvents, trackAuthEvent } from '../utils/analytics';
import { createAxiosClient } from '../utils/utils';
import { Auth0Token } from '../interfaces/auth0Token';
import { AuthStatus, signIn, useAuthContext } from '../hooks/useAuthContext';
import useFirstTimeVisitor from '../hooks/useFirstTimeVisitor';
import { Auth0Profile } from '../interfaces/auth0Profile';
import { Company } from '../interfaces/company';
import { User } from '../interfaces/user';

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
  try {
    const skipXUserAgent = true;
    const auth0AxiosClient = createAxiosClient(auth0Token, skipXUserAgent);
    const { data: userInfo } = await auth0AxiosClient.get(`${REACT_APP_AUTH0_DOMAIN}/userinfo`);
    auth0Profile = userInfo;
    const fusebitAxiosClient = createAxiosClient(auth0Token);
    const { data: account } = await fusebitAxiosClient.get(`${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}`);
    company = account;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return {
    auth0Profile,
    company,
  };
};

const AuthCallbackPage: FC<{}> = (): ReactElement => {
  const location = useLocation();
  const history = useHistory();
  const { setAuthStatus, setUserData } = useAuthContext();
  const { setFirstTimeVisitor } = useFirstTimeVisitor();

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(location.hash.substring(1));
      const error = urlParams.get('error');
      const token = urlParams.get('access_token') || undefined;

      if (error || !token) {
        if (error && error !== 'login_required') {
          // eslint-disable-next-line no-console
          console.error('Callback URL called without token or with an unknown error.', location);
        }
        signIn();
        return;
      }

      const decoded = jwt_decode<Auth0Token>(token);
      const fusebitProfile = decoded['https://fusebit.io/profile'];
      const isSignUpEvent = decoded['https://fusebit.io/new-user'] === true;

      getAuth0ProfileAndCompany(token, fusebitProfile?.accountId || '').then(({ auth0Profile, company }) => {
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
          const requestedPath = urlSearchParams.get('requestedPath') || '/';

          setFirstTimeVisitor(true);
          history.push(requestedPath);
        };

        const isSegmentConfigured = process.env.REACT_APP_SEGMENT_ANALYTICS_TAG;
        if (isSegmentConfigured) {
          getAnalyticsClient().ready(() => {
            if (isSegmentTrackingEvents()) {
              const user: User = { ...auth0Profile, ...company };
              trackAuthEvent(user, fusebitProfile, isSignUpEvent, navigatePostAuth);
            } else {
              navigatePostAuth();
            }
          });
        } else {
          navigatePostAuth();
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      history.push('/logged-out');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default AuthCallbackPage;
