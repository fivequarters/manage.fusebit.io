import { FC, ReactNode } from 'react';
import { AuthStatus, useAuthContext, signIn } from '../hooks/useAuthContext';

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { authStatus, checkAuthStatus } = useAuthContext();
  if (authStatus === AuthStatus.UNKNOWN) {
    checkAuthStatus();
  }
  if (authStatus === AuthStatus.AUTHENTICATED) {
    return <>{children}</>;
  }
  if (authStatus === AuthStatus.UNAUTHENTICATED) {
    signIn();
  }
  return <></>;
};

export default ProtectedRoute;
