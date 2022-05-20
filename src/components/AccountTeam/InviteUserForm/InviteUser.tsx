import CopyLine from '@components/common/CopyLine';
import { Props } from '@interfaces/newUser';
import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as CSC from '../../globalStyle';

const StyledFormInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 48px;
  justify-content: center;
`;

const InviteUserForm = React.forwardRef<HTMLDivElement, Props>(({ onClose, createUser }, ref) => {
  const [userCreating, setUserCreating] = React.useState(false);
  const [token, setToken] = React.useState('');

  useEffect(() => {
    if (!userCreating) {
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
    <div ref={ref}>
      <>
        <CSC.ModalTitle margin="48px 0">Invite New User</CSC.ModalTitle>
        <CSC.ModalDescription>
          Securely share the following invitation URL with the user. The invitation expires in eight hours.
        </CSC.ModalDescription>
        <div style={{ maxWidth: 800 }}>
          <CopyLine text={invitationUrl}>{invitationUrl}</CopyLine>
        </div>
        <StyledFormInputWrapper>
          <Button
            onClick={() => onClose()}
            style={{ width: '200px' }}
            fullWidth={false}
            size="large"
            color="primary"
            variant="contained"
            disabled={!token}
          >
            {(!!token && 'Done') || 'Inviting...'}
          </Button>
        </StyledFormInputWrapper>
      </>
    </div>
  );
});

export default InviteUserForm;
