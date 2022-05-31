import { useAuthContext } from '@hooks/useAuthContext';
import { Props } from '@interfaces/newUser';
import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import SecurityDisclaimer from '@components/common/SecurityDisclaimer';
import CopyLine from '@components/common/CopyLine';
import { trackEventMemoized } from '@utils/analytics';
import * as CSC from '../../globalStyle';

const StyledWrapper = styled.div`
  width: 560px;
  padding-bottom: 24px;

  @media only screen and (max-width: 730px) {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const StyledLineTitle = styled.h3`
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 12px;
`;

const InviteUserForm = React.forwardRef<HTMLDivElement, Props>(({ createUser }, ref) => {
  const [userCreating, setUserCreating] = React.useState(false);
  const [token, setToken] = React.useState('');
  const { userData } = useAuthContext();

  useEffect(() => {
    if (!userCreating && !token) {
      setUserCreating(true);
      (async () => {
        const _token = await createUser({
          firstName: 'Invitation',
          lastName: 'Pending',
        });
        setToken(_token);
      })();
    }
  }, [userCreating, token, createUser]);

  const invitationUrl = token ? `${window.location.protocol}//${window.location.host}/#init=${token}` : '';

  return (
    <StyledWrapper ref={ref}>
      <Box maxWidth="400px" margin="0 auto">
        <CSC.ModalTitle margin="32px 0">Invite Team Member to {userData.company}</CSC.ModalTitle>
        <CSC.ModalDescription textAlign="center">
          Securely share the following link with your Team Member.
        </CSC.ModalDescription>
      </Box>
      <StyledLineTitle>Invite Link</StyledLineTitle>
      <CopyLine
        text={invitationUrl}
        disableMargin
        copyPosition={{ top: '-47px' }}
        onCopy={() => {
          trackEventMemoized('Copy Invite Link Clicked', 'Team');
        }}
      >
        <p>{invitationUrl}</p>
      </CopyLine>
      <SecurityDisclaimer>For security reasons, this link will expire in eight hours.</SecurityDisclaimer>
    </StyledWrapper>
  );
});

export default InviteUserForm;
