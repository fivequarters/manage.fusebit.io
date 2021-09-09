import React, { useState } from 'react';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { Button, Input } from '@material-ui/core';
import { Props } from '../../../../../interfaces/connect';
import CopyLine from '../../../../CopyLine';
import { useCopy } from '../../../../../hooks/useCopy';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

const Connect = React.forwardRef(
  ({ id, token, onClose, open, setKeyIsCopied, keyIsCopied, setShowWarning, showWarning, disableCopy }: Props, ref) => {
    const [editMode, setEditMode] = useState(false);
    const [editedBackendClientId, setEditedBackendClientId] = useState(id);
    const [backendClientId, setBackendClientId] = useState(id);
    const { handleCopy, copiedLine } = useCopy();

    const handleClose = () => {
      if (disableCopy) {
        onClose();
      } else if (setShowWarning) {
        keyIsCopied || showWarning ? onClose(keyIsCopied, showWarning) : setShowWarning(true);
      }
    };

    const handleSave = () => {
      setBackendClientId(editedBackendClientId);
      setEditMode(false);
    };

    const handleCancel = () => {
      setEditedBackendClientId(backendClientId);
      setEditMode(false);
    };

    return (
      <SC.Card open={open}>
        <SC.Wrapper>
          <CSC.Close onClick={handleClose} />

          <CSC.ModalTitle>{backendClientId}</CSC.ModalTitle>
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
                  style={{ marginLeft: '24px' }}
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Save
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
          <SC.SmallTitleWrapper>
            <SC.SmallTitle>
              <strong>Integration Base URL:</strong> {REACT_APP_FUSEBIT_DEPLOYMENT}
            </SC.SmallTitle>
            <CSC.Copy onClick={() => handleCopy('https://api.us-west-2...')} margin="0 0 0 20px" />
            <SC.CopySuccess copy={copiedLine}>Copied to clipboard!</SC.CopySuccess>
          </SC.SmallTitleWrapper>

          <SC.Hr />

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

          <SC.Hr />

          <SC.Subtitle>Connect your Backend</SC.Subtitle>
          <CSC.Flex margin="32px 0 0 0">
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
                Download sample
              </Button>
              <CSC.Flex>
                <SC.TimeIcon />
                <SC.TimeDescription>2 minutes</SC.TimeDescription>
              </CSC.Flex>
              <SC.TimeDescription margin="0">Already configured to work with this integration</SC.TimeDescription>
            </CSC.Flex>
          </CSC.Flex>

          <CSC.Flex margin="88px 0 0 auto" width="max-content">
            <Button style={{ width: '200px', marginRight: '32px' }} variant="outlined" color="primary" size="large">
              Delete
            </Button>
            <Button onClick={handleClose} style={{ width: '200px' }} variant="contained" color="primary" size="large">
              OK
            </Button>
          </CSC.Flex>
        </SC.Wrapper>
      </SC.Card>
    );
  }
);

export default Connect;
