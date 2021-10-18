import { useAuthContext } from './useAuthContext';

export const useGetRedirectLink = () => {
  const { userData } = useAuthContext();

  const getRedirectLink = (url: string) => {
    const redirectLink = `/account/${userData.accountId}/subscription/${userData.subscriptionId}${url}`;
    return redirectLink;
  };

  return {
    getRedirectLink,
  };
};
