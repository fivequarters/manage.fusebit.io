import { Auth0InviteProfile } from '@interfaces/auth0Profile';
import { INVITED_TO_FUSEBIT_KEY } from '@utils/constants';

const useIsInvitedToFusebit = () => {
  const isInvitedToFusebit = !!localStorage.getItem(INVITED_TO_FUSEBIT_KEY);

  const removeIsInvitedToFusebitKey = () => {
    localStorage.removeItem(INVITED_TO_FUSEBIT_KEY);
  };

  return {
    isInvitedToFusebit,
    removeIsInvitedToFusebitKey,
    profile: isInvitedToFusebit
      ? (JSON.parse(localStorage.getItem(INVITED_TO_FUSEBIT_KEY) || '') as Auth0InviteProfile)
      : undefined,
  };
};

export default useIsInvitedToFusebit;
