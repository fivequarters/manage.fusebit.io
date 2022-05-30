import { useAuthContext } from '@hooks/useAuthContext';
import useIsInvitedToFusebit from '@hooks/useIsInvitedToFusebit';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@hooks/useQuery';
import styled from 'styled-components';
import { UTM_CONTENT } from '@components/Onboarding/Onboarding';
import Modal from '../Modal';

const StyledDescription = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  width: 400px;
  margin-bottom: 40px;
  text-align: center;
`;

const InvitedToFusebitModal = () => {
  const { userData } = useAuthContext();
  const { isInvitedToFusebit, removeIsInvitedToFusebitKey } = useIsInvitedToFusebit();
  const query = useQuery();
  const isNewVidOnboarding = query.get('utm_content') === UTM_CONTENT.NEW_VID;
  const [open, setOpen] = useState(!!isInvitedToFusebit && !isNewVidOnboarding);

  useEffect(() => {});

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
      <StyledDescription>You've been added to {userData.company}</StyledDescription>
    </Modal>
  );
};

export default InvitedToFusebitModal;
