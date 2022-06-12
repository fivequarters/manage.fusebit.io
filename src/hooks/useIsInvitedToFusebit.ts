import { INVITED_TO_FUSEBIT_KEY } from '@utils/constants';

const useIsInvitedToFusebit = () => {
  const isInvitedToFusebit = localStorage.getItem(INVITED_TO_FUSEBIT_KEY);

  const removeIsInvitedToFusebitKey = () => {
    localStorage.removeItem(INVITED_TO_FUSEBIT_KEY);
  };

  return {
    isInvitedToFusebit,
    removeIsInvitedToFusebitKey,
  };
};

export default useIsInvitedToFusebit;
