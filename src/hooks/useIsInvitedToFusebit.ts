import { Auth0InviteProfile } from '@interfaces/auth0Profile';
import { INVITED_TO_FUSEBIT_KEY } from '@utils/constants';

const useIsInvitedToFusebit = () => {
  const isInvitedToFusebit = localStorage.getItem(INVITED_TO_FUSEBIT_KEY);
  const profile = JSON.parse(localStorage.getItem(INVITED_TO_FUSEBIT_KEY) || '') as Auth0InviteProfile;

  const removeIsInvitedToFusebitKey = () => {
    localStorage.removeItem(INVITED_TO_FUSEBIT_KEY);
  };

  return {
    profile,
    isInvitedToFusebit: !!isInvitedToFusebit,
    removeIsInvitedToFusebitKey,
  };
};

export default useIsInvitedToFusebit;
