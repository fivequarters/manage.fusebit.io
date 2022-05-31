import { FC, ReactNode, useEffect, useRef } from 'react';
import { AuthStatus, useAuthContext, signIn } from '@hooks/useAuthContext';

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { authStatus, checkAuthStatus } = useAuthContext();
  const isCheckingAuthStatus = useRef(false);

  useEffect(() => {
    if (authStatus === AuthStatus.UNKNOWN && !isCheckingAuthStatus.current) {
      checkAuthStatus();
      isCheckingAuthStatus.current = true;
    }

    if (authStatus === AuthStatus.UNAUTHENTICATED) {
      signIn();
    }
  }, [authStatus, checkAuthStatus]);

  return <>{authStatus === AuthStatus.AUTHENTICATED && children}</>;
};

export default ProtectedRoute;
