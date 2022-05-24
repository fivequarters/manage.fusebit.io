import { FC, ReactElement, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { signIn, useAuthContext } from '@hooks/useAuthContext';

const AuthCallbackPage: FC<{}> = (): ReactElement => {
  const location = useLocation();
  const { handleAuthError, authUser } = useAuthContext();

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(location.hash.substring(1));
      const error = urlParams.get('error');
      const token = urlParams.get('access_token') || undefined;

      if (error || !token) {
        if (error && error !== 'login_required') {
          const err =
            'This initialization token is no longer valid.  Please request a new url from an authorized Fusebit User.';
          handleAuthError(err);
        }
        signIn();
        return;
      }

      authUser(token);
    } catch (err) {
      handleAuthError(err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default AuthCallbackPage;
