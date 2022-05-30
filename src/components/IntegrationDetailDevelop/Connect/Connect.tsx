import React from 'react';
import { Box, Button, Input, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as CSC from '@components/globalStyle';
import CopyLine from '@components/common/CopyLine';
import SecurityDisclaimer from '@components/common/SecurityDisclaimer';
import { Integration } from '@interfaces/integration';
import styled from 'styled-components';
import warning from '@assets/black-warning.svg';
import { trackEventMemoized } from '@utils/analytics';
import FooterActions from './FooterActions';
import useConnect, { Props as UseConnectProps } from './useConnect';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 667px;
  padding-top: 0px;

  @media only screen and (max-width: 880px) {
    width: 100%;
    padding: 56px 24px;
  }

  @media only screen and (max-width: 370px) {
    padding: 56px 16px;
  }
`;

const StyledSmallTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledSmallTitle = styled.h4`
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  color: var(--black);
  margin: 0;
  max-width: 600px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  strong {
    font-weight: 600;
    line-height: 18px;
  }
`;

const StyledSubtitle = styled.h3<{ margin?: string }>`
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
  margin: ${(props) => props.margin && props.margin};
`;

const StyledCopySuccess = styled.p<{ copy: boolean }>`
  position: absolute;
  bottom: -35px;
  font-size: 14px;
  line-height: 16px;
  color: var(--grey);
  opacity: ${(props) => (props.copy ? 1 : 0)};
  visibility: ${(props) => (props.copy ? 'visible' : 'hidden')};
  margin-left: auto;
  transition: all 0.5s linear;
`;

const StyledWarningWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px;
  background-color: var(--yellow);
  border-radius: 8px;

  @media only screen and (max-width: 420px) {
    padding: 16px;
  }

  p {
    font-size: 14px;
    line-height: 20px;
    margin: 0;
    color: var(--black);

    @media only screen and (max-width: 420px) {
      font-size: 12px;
      line-height: 16px;
    }

    @media only screen and (max-width: 325px) {
      font-size: 11px;
    }
  }
`;

const StyledWarningIcon = styled.div`
  min-height: 19px;
  min-width: 22px;
  background-image: url(${warning});
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 16px;
`;

interface Props extends UseConnectProps {
  open: boolean;
  token: string;
  integration?: Integration;
  setKeyIsCopied?: Function;
  onDelete: Function;
}

const Connect: React.FC<Props> = ({
  id,
  name,
  token,
  integration,
  onClose,
  onChange,
  onDelete,
  setKeyIsCopied,
  keyIsCopied,
  setShowWarning,
  showWarning,
  disableCopy,
}) => {
  const {
    backendClientId,
    copiedLine,
    editMode,
    editedBackendClientId,
    handleCancel,
    handleClose,
    handleCopy,
    handleSave,
    integrationBaseUrl,
    saving,
    setEditMode,
    setEditedBackendClientId,
    buttonsCrashing,
    smallPhone,
    isMobile,
  } = useConnect({
    disableCopy,
    id,
    name,
    keyIsCopied,
    onChange,
    onClose,
    setShowWarning,
    showWarning,
  });

  const getMainButtonWidth = (() => {
    if (smallPhone) {
      return '136px';
    }

    if (buttonsCrashing) {
      return '156px';
    }

    return '200px';
  })();

  const enterEditMode = () => {
    trackEventMemoized('Backend Edit Name Button Clicked', 'My Application', {
      Integration: integration?.tags['fusebit.feedId'],
    });
    setEditMode(true);
  };

  return (
    <StyledWrapper>
      {isMobile && (
        <CSC.CloseWrapper aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CSC.CloseWrapper>
      )}

      <CSC.ModalTitle margin="0 0 42px 0">{backendClientId}</CSC.ModalTitle>
      <StyledSmallTitleWrapper>
        <StyledSmallTitle>
          <strong>Key Name:</strong>
        </StyledSmallTitle>
        {!editMode ? (
          <>
            <StyledSmallTitle>&nbsp; {backendClientId}</StyledSmallTitle>
            <Button
              style={{ marginLeft: '24px' }}
              onClick={() => enterEditMode()}
              variant="outlined"
              color="primary"
              size="small"
            >
              Edit
            </Button>
          </>
        ) : (
          <>
            <Input
              id="standard-adornment-weight"
              value={editedBackendClientId}
              onChange={(e) => setEditedBackendClientId(e.target.value)}
              aria-describedby="standard-backend-Client-Id-helper-text"
              style={{ width: '214px', marginLeft: '8.5px' }}
              inputProps={{
                'aria-label': 'Name',
              }}
            />
            <Button
              disabled={saving}
              style={{ marginLeft: '24px', width: '70px' }}
              onClick={handleSave}
              variant="contained"
              color="primary"
              size="small"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              style={{ marginLeft: '16px' }}
              onClick={handleCancel}
              variant="outlined"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
          </>
        )}
      </StyledSmallTitleWrapper>
      <Box display="flex" alignItems="center" mb="15px" position="relative">
        <StyledSmallTitle>
          <strong>Integration Base URL:</strong> {integrationBaseUrl}
        </StyledSmallTitle>
        <CSC.Copy onClick={() => handleCopy(integrationBaseUrl as string)} margin="0 0 0 20px" />
        <StyledCopySuccess copy={copiedLine}>Copied to clipboard!</StyledCopySuccess>
      </Box>

      <StyledSubtitle>Key</StyledSubtitle>
      <CopyLine
        disableCopy={disableCopy}
        warning={showWarning && !keyIsCopied}
        onCopy={() => setKeyIsCopied && setKeyIsCopied(true)}
        text={token}
      >
        {token}
      </CopyLine>

      {showWarning && !keyIsCopied ? (
        <StyledWarningWrapper>
          <StyledWarningIcon />
          <Typography>You did not copy the key above. It will be lost after you close this window.</Typography>
        </StyledWarningWrapper>
      ) : (
        !disableCopy && (
          <SecurityDisclaimer>
            For security reasons, <strong>this is the last time you will see this key.</strong>
          </SecurityDisclaimer>
        )
      )}

      <StyledSubtitle margin="32px auto">Connect your Backend</StyledSubtitle>
      <FooterActions buttonsCrashing={buttonsCrashing} integration={integration} />

      <Box
        display="flex"
        alignItems="center"
        position="relative"
        margin={buttonsCrashing ? '50px auto 0' : '50px 0 0 auto'}
        width="max-content"
      >
        <Button
          onClick={() => onDelete()}
          style={{
            width: getMainButtonWidth,
            marginRight: buttonsCrashing ? '16px' : '32px',
          }}
          variant="outlined"
          color="primary"
          size={buttonsCrashing ? 'medium' : 'large'}
        >
          Delete
        </Button>
        <Button
          onClick={handleClose}
          style={{
            width: getMainButtonWidth,
          }}
          variant="contained"
          color="primary"
          size={buttonsCrashing ? 'medium' : 'large'}
        >
          OK
        </Button>
      </Box>
    </StyledWrapper>
  );
};

export default Connect;
