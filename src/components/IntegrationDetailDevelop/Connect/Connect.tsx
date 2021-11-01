import React from 'react';
import { Box, Button, Input } from '@material-ui/core';
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
      />
      {showWarning && !keyIsCopied ? (
        <SC.WarningWrapper>
          <SC.WarningIcon />
          You did not copy the key above. It will be lost after you close this window.
        </SC.WarningWrapper>
      ) : (
        !disableCopy && (
          <CSC.Flex margin="0 0 10px 0">
            <SC.DisclaimerIcon />
            <SC.Disclaimer>
              For security reasons, <strong>this is the last time you will see this key.</strong>
            </SC.Disclaimer>
          </CSC.Flex>
        )
      )}

      <SC.Subtitle style={{ margin: '32px auto 16px' }}>Connect your Backend</SC.Subtitle>
      <CSC.Flex flexDown>
        <CSC.Flex>
          <Button
            style={{ margin: '0 auto', width: '293px' }}
            target="_blank"
            rel="noopener"
            href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
            variant="outlined"
            color="primary"
            size="large"
          >
            Follow guide
          </Button>
          {isSampleAppEnabled && (
            <>
              or
              <LinkSampleApp componentMap={componentMap} />
            </>
          )}
        </CSC.Flex>
        <CSC.Flex>
          <div style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
            <SC.TimeIcon />
            <SC.TimeDescription>10 minutes</SC.TimeDescription>
          </div>
          {isSampleAppEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
              <SC.TimeIcon />
              <SC.TimeDescription>2 minutes.</SC.TimeDescription>
            </div>
          )}
        </CSC.Flex>
      </CSC.Flex>
      {/* <CSC.Flex margin="32px 0 0 0">
            <CSC.Flex flexDown width="293px" margin="0 0 auto 0">
              <Button
                target="_blank"
                rel="noopener"
                href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
                variant="outlined"
                color="primary"
                size="large"
              >
                Follow guide
              </Button>
              <CSC.Flex>
                <SC.TimeIcon />
                <SC.TimeDescription>10 minutes</SC.TimeDescription>
              </CSC.Flex>
            </CSC.Flex>
            <SC.Or>or</SC.Or>
            <CSC.Flex flexDown width="293px">
              <Button variant="outlined" color="primary" size="large">
                Launch sample app
              </Button>
              <CSC.Flex>
                <SC.TimeIcon />
                <SC.TimeDescription>2 minutes</SC.TimeDescription>
              </CSC.Flex>
              <SC.TimeDescription margin="0">Already configured to work with this integration</SC.TimeDescription>
            </CSC.Flex>
          </CSC.Flex> */}

      <CSC.Flex margin="50px 0 0 auto" width="max-content">
        <Button
          onClick={() => onDelete()}
          style={{ width: '200px', marginRight: '32px' }}
          variant="outlined"
          color="primary"
          size="large"
        >
          Delete
        </Button>
        <Button onClick={handleClose} style={{ width: '200px' }} variant="contained" color="primary" size="large">
          OK
        </Button>
      </CSC.Flex>
    </SC.Wrapper>
  );
};

export default Connect;
