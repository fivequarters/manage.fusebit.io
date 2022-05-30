import { useAuthContext } from '@hooks/useAuthContext';
import { useCopy } from '@hooks/useCopy';
import { Props } from '@interfaces/newUser';
import { Box, Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import link from '@assets/link.svg';
import SecurityDisclaimer from '@components/common/SecurityDisclaimer';
import * as CSC from '../../globalStyle';

const StyledFormInputWrapper = styled.div<{ enabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  justify-content: center;
  display: ${(props) => !props.enabled && 'none'};
  opacity: ${(props) => (props.enabled ? 1 : 0)};
  transition: all 0.25s ease-out;
`;

const StyledCopiedContainer = styled.div<{ enabled: boolean }>`
  max-height: ${(props) => !props.enabled && 0};
  visibility: ${(props) => (props.enabled ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.enabled ? 1 : 0)};
  transition: opacity 0.25s ease-in;
`;

const StyledCopiedWrapper = styled.div`
  font-family: 'Courier';
  font-weight: 400;
  font-size: 14px;
  overflow-wrap: break-word;
  background-color: var(--secondary-color);
  border-radius: 4px;
  color: var(--black);
  padding: 16px;
`;

const StyledWrapper = styled.div`
  width: 560px;
  padding-bottom: 24px;

  @media only screen and (max-width: 730px) {
    width: 100%;
  }
`;

const InviteUserForm = React.forwardRef<HTMLDivElement, Props>(({ createUser }, ref) => {
  const [userCreating, setUserCreating] = React.useState(false);
  const [token, setToken] = React.useState('');
  const [isInvitationCopied, setIsInvitationCopied] = React.useState(false);
  const { userData } = useAuthContext();
  const { handleCopy } = useCopy();

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

  const handleClick = (url: string) => {
    handleCopy(url);
    setIsInvitationCopied(true);
  };

  return (
    <StyledWrapper ref={ref}>
      <Box maxWidth="400px" margin="0 auto">
        <CSC.ModalTitle margin="32px 0">Invite Team Member to {userData.company}</CSC.ModalTitle>
        <CSC.ModalDescription textAlign="center">
          {isInvitationCopied
            ? 'The following link has been copied to Clipboard!'
            : 'Securely share the following link with your Team Member to add them to your Account.'}
        </CSC.ModalDescription>
      </Box>
      <StyledFormInputWrapper enabled={!isInvitationCopied}>
        <Button
          onClick={() => handleClick(invitationUrl)}
          style={{ width: '200px' }}
          fullWidth={false}
          size="large"
          color="primary"
          variant="contained"
          disabled={!token}
          startIcon={<img src={link} alt="link" height="16px" width="16px" />}
        >
          Copy invite link
        </Button>
      </StyledFormInputWrapper>
      <StyledCopiedContainer enabled={isInvitationCopied}>
        <StyledCopiedWrapper>{invitationUrl}</StyledCopiedWrapper>
        <SecurityDisclaimer>For security reasons, this link will expire in eight hours.</SecurityDisclaimer>
      </StyledCopiedContainer>
    </StyledWrapper>
  );
});

export default InviteUserForm;
