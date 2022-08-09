import { useAuthContext } from '@hooks/useAuthContext';
import useIsInvitedToFusebit from '@hooks/useIsInvitedToFusebit';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@hooks/useQuery';
import styled from 'styled-components';
import { trackEventMemoized } from '@utils/analytics';
import { UTM_CONTENT } from '@components/Onboarding/Onboarding';
import { useAccountGetOne } from '@hooks/api/v1/account/useGetOne';
import { Account } from '@interfaces/account';
import * as CSC from '@components/globalStyle';
import { Box, useMediaQuery } from '@material-ui/core';
import Modal from '../Modal';

const StyledDescription = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  margin-bottom: 40px;
  text-align: center;
`;

const InvitedToFusebitModal = () => {
  const { userData } = useAuthContext();
  const { profile, isInvitedToFusebit, removeIsInvitedToFusebitKey } = useIsInvitedToFusebit();
  const { data: accountData, isLoading } = useAccountGetOne<Account>({
    enabled: userData.token && isInvitedToFusebit,
    accountId: profile.account,
  });
  const query = useQuery();
  const isNewVidOnboarding = query.get('utm_content') === UTM_CONTENT.NEW_VID;
  const [open, setOpen] = useState(!!isInvitedToFusebit && !isNewVidOnboarding);
  const isMobile = useMediaQuery('(max-width: 550px)');

  useEffect(() => {
    if (open) {
      trackEventMemoized('Join Team Modal Viewed', 'Integrations');
    }
  }, [open]);

  const closeModal = () => {
    setOpen(false);
    removeIsInvitedToFusebitKey();
  };

  return (
    <Modal
      open={open}
      title="Welcome Aboard!"
      acceptButtonText="Get Started"
      onAccept={closeModal}
      onClose={closeModal}
    >
      <Box display="flex" alignItems="center" justifyContent="center" width={isMobile ? '100%' : '400px'}>
        <StyledDescription>
          You've been added to{' '}
          {isLoading ? (
            <Box ml="6px">
              <CSC.Spinner />
            </Box>
          ) : (
            accountData?.data.displayName
          )}
        </StyledDescription>
      </Box>
    </Modal>
  );
};

export default InvitedToFusebitModal;
