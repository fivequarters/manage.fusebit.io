import React from 'react';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LinkIcon from '@material-ui/icons/Link';
import { Props } from '../../../../../interfaces/connect';
import { Decoded } from '../../../../../interfaces/decoded';
import { useContext } from '../../../../../hooks/useContext';
import jwt_decode from 'jwt-decode';
import { useGetAuthLink } from '../../../../../hooks/useGetAuthLink';
import CopyLine from '../../../../CopyLine';

const Connect = React.forwardRef(({ onClose, open }: Props, ref) => {
  const { userData } = useContext();
  const { getAuthLink } = useGetAuthLink();
  const [expDate, setExpDate] = React.useState('');

  const handleRefresh = () => {
    localStorage.setItem('refreshToken', 'true');
    localStorage.setItem('refreshTokenUrl', window.location.pathname);
    window.location.href = getAuthLink();
  };

  React.useEffect(() => {
    if (userData) {
      const token = userData.token;
      if (token !== undefined) {
        const decoded: Decoded = jwt_decode(token);
        const exp = decoded.exp;
        const expInmilliseconds = exp * 1000;
        const dateObject = new Date(expInmilliseconds);
        const localExpDate = dateObject.toLocaleString();
        setExpDate(localExpDate);
      }
    }
  }, [userData]);

  return (
    <SC.Card open={open}>
      <CSC.Close onClick={() => onClose()} />
      <CSC.ModalTitle>Connect your application</CSC.ModalTitle>
      <CSC.Flex>
        <CSC.LineTitle>Access Token</CSC.LineTitle>
      </CSC.Flex>
      <CSC.ModalDescription>Expires on {expDate}</CSC.ModalDescription>
      <CopyLine text={userData.token || ''} />
      <SC.ButtonWrapper>
        <Button onClick={handleRefresh} style={{ width: '200px' }} size="large" variant="outlined" color="primary">
          Refresh Your Token
        </Button>
      </SC.ButtonWrapper>

      <CSC.Flex>
        <CSC.LineTitle margin="16px">Integration Base URL</CSC.LineTitle>
      </CSC.Flex>
      <CopyLine text={process.env.REACT_APP_FUSEBIT_DEPLOYMENT + '/v2' + window.location.pathname} />
      <CSC.ModalDescription margin="24px 0 24px 0">
        To connect your application, use the values above and follow the instructions in the{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
        >
          following document.
        </a>
      </CSC.ModalDescription>
      <SC.ButtonWrapper>
        <Button onClick={() => onClose()} style={{ width: '200px' }} size="large" variant="contained" color="primary">
          Ok
        </Button>
      </SC.ButtonWrapper>
      {false && (
        <>
          <CSC.ModalTitle>Development</CSC.ModalTitle>
          <SC.CardButtonsContainer>
            <Button
              startIcon={<AddIcon />}
              style={{ marginBottom: '16px' }}
              size="large"
              variant="outlined"
              color="primary"
            >
              Generate API Key
            </Button>
            <Button startIcon={<AddIcon />} size="large" variant="outlined" color="primary">
              Refresh Your Token
            </Button>
          </SC.CardButtonsContainer>
          <CSC.ModalTitle>Production</CSC.ModalTitle>
          <SC.CardButtonsContainer>
            <Button
              startIcon={<AddIcon />}
              style={{ marginBottom: '16px' }}
              size="large"
              variant="outlined"
              color="primary"
            >
              Create Client
            </Button>
            <Button startIcon={<LinkIcon />} size="large" variant="outlined" color="primary">
              Link existing client
            </Button>
          </SC.CardButtonsContainer>
          <SC.CardActionButtons>
            <Button style={{ marginRight: '16px' }} size="medium" variant="outlined" color="primary">
              Reset
            </Button>
            <Button size="medium" variant="contained" color="primary">
              Save
            </Button>
          </SC.CardActionButtons>
        </>
      )}
    </SC.Card>
  );
});

export default Connect;
