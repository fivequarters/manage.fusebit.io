import React from 'react';
import { Box, Button, Input, Typography } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import CopyLine from '@components/common/CopyLine';
import { Integration } from '@interfaces/integration';
import { LinkSampleApp } from './LinkSampleApp';
import useConnect, { Props as UseConnectProps } from './useConnect';
import * as SC from './styles';

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
    componentMap,
    copiedLine,
    editMode,
    editedBackendClientId,
    handleCancel,
    handleClose,
    handleCopy,
    handleSave,
    integrationBaseUrl,
    isSampleAppEnabled,
    saving,
    setEditMode,
    setEditedBackendClientId,
    buttonsCrashing,
    smallPhone,
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

  const getButtonSize = (() => {
    if (smallPhone && isSampleAppEnabled) {
      return 'small';
    }

    if (buttonsCrashing) {
      return 'medium';
    }

    return 'large';
  })();

  const getTimeDescriptionWidth = (() => {
    if (smallPhone) {
      return '140px';
    }

    if (buttonsCrashing) {
      return '165px';
    }

    return '100%';
  })();

  const getMainButtonWidth = (() => {
    if (smallPhone) {
      return '136px';
    }

    if (buttonsCrashing) {
      return '156px';
    }

    return '200px';
  })();

  return (
    <SC.Wrapper>
      <CSC.Close onClick={handleClose} />

      <CSC.ModalTitle margin="0 0 42px 0">{backendClientId}</CSC.ModalTitle>
      <SC.SmallTitleWrapper>
        <SC.SmallTitle>
          <strong>Key Name:</strong>
        </SC.SmallTitle>
        {!editMode ? (
          <>
            <SC.SmallTitle>&nbsp; {backendClientId}</SC.SmallTitle>
            <Button
              style={{ marginLeft: '24px' }}
              onClick={() => setEditMode(true)}
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
      </SC.SmallTitleWrapper>
      <Box display="flex" alignItems="center" mb="15px" position="relative">
        <SC.SmallTitle>
          <strong>Integration Base URL:</strong> {integrationBaseUrl}
        </SC.SmallTitle>
        <CSC.Copy onClick={() => handleCopy(integrationBaseUrl as string)} margin="0 0 0 20px" />
        <SC.CopySuccess copy={copiedLine}>Copied to clipboard!</SC.CopySuccess>
      </Box>

      <SC.Subtitle>Key</SC.Subtitle>
      <CopyLine
        disableCopy={disableCopy}
        warning={showWarning && !keyIsCopied}
        onCopy={() => setKeyIsCopied && setKeyIsCopied(true)}
        text={token}
      >
        {token}
      </CopyLine>

      {showWarning && !keyIsCopied ? (
        <SC.WarningWrapper>
          <SC.WarningIcon />
          <Typography>You did not copy the key above. It will be lost after you close this window.</Typography>
        </SC.WarningWrapper>
      ) : (
        !disableCopy && (
          <CSC.Flex>
            <SC.DisclaimerIcon />
            <SC.Disclaimer>
              For security reasons, <strong>this is the last time you will see this key.</strong>
            </SC.Disclaimer>
          </CSC.Flex>
        )
      )}

      <SC.Subtitle margin="32px auto">Connect your Backend</SC.Subtitle>
      <CSC.Flex flexDown>
        <Box
          display="flex"
          alignItems={!isSampleAppEnabled && 'center'}
          justifyContent={!isSampleAppEnabled && 'center'}
        >
          <Box display="flex" flexDirection="column">
            <Button
              style={{ width: buttonsCrashing ? 'fit-content' : '293px' }}
              target="_blank"
              rel="noopener"
              href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
              variant="outlined"
              color="primary"
              size={getButtonSize}
            >
              Follow guide
            </Button>
            <Box display="flex" alignItems="center" justifyContent={!isSampleAppEnabled && 'center'}>
              <SC.TimeIcon />
              <SC.TimeDescription>10 minutes</SC.TimeDescription>
            </Box>
          </Box>
          {isSampleAppEnabled && (
            <>
              <Box display="flex" margin={smallPhone ? '5px auto auto' : '10.5px auto auto'}>
                or
              </Box>
              <Box display="flex" flexDirection="column">
                <LinkSampleApp
                  buttonsSize={getButtonSize}
                  buttonsCrashing={buttonsCrashing}
                  componentMap={componentMap}
                />
                <Box display="flex" flexDirection="column" alignItems="left" justifyContent="left">
                  <Box display="flex" alignItems="center">
                    <SC.TimeIcon />
                    <SC.TimeDescription>2 minutes.</SC.TimeDescription>
                  </Box>
                  <Box maxWidth={getTimeDescriptionWidth}>
                    <SC.TimeDescription margin="0">Already configured to work with this integration</SC.TimeDescription>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </CSC.Flex>
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
    </SC.Wrapper>
  );
};

export default Connect;
