import React, { useState } from 'react';
import { Button, Input } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import * as SC from './styles';
import * as CSC from '../../globalStyle';
import CopyLine from '../../common/CopyLine';
import { useCopy } from '../../../hooks/useCopy';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';

import { LinkSampleApp } from './LinkSampleApp';
import { useAccountIntegrationsGetOne } from '../../../hooks/api/v2/account/integration/useGetOne';
import { Integration } from '../../../interfaces/integration';
import { useBackendUpdateOne } from '../../../hooks/api/v1/backend/useUpdateOne';
import DeleteBackendModal from '../DeleteBackendModal';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

interface Props {
  onClose: Function;
  onDelete: Function;
  onChange?: () => void;
  open: boolean;
  id: string;
  name: string;
  token: string;
  keyIsCopied?: boolean;
  setKeyIsCopied?: Function;
  showWarning?: boolean;
  setShowWarning?: Function;
  disableCopy?: boolean;
  integration?: Integration;
}

const Connect = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      id,
      name,
      token,
      onClose,
      onChange,
      onDelete,
      open,
      setKeyIsCopied,
      keyIsCopied,
      setShowWarning,
      showWarning,
      disableCopy,
    },
    ref
  ) => {
    const { id: integrationId } = useParams<{ id: string }>();
    const { getRedirectLink } = useGetRedirectLink();
    const { userData } = useAuthContext();
    const [editMode, setEditMode] = useState(false);
    const [editedBackendClientId, setEditedBackendClientId] = useState(name);
    const [backendClientId, setBackendClientId] = useState(name);
    const { handleCopy, copiedLine } = useCopy();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const integrationBaseUrl = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2${getRedirectLink(`/integration/${integrationId}`)}`;
    const { mutateAsync: updateBackend } = useBackendUpdateOne();

    const { data: integrationData } = useAccountIntegrationsGetOne({
      enabled: userData.token,
      id: integrationId,
      accountId: userData.accountId,
      subscriptionId: userData.subscriptionId,
    });

    const handleClose = () => {
      if (disableCopy) {
        onClose();
      } else if (setShowWarning) {
        if (keyIsCopied || showWarning) {
          onClose();
        } else {
          setShowWarning(true);
        }
      }
    };

    const handleSave = async () => {
      setSaving(true);
      await updateBackend({ id, updatedBackend: { name: editedBackendClientId } });
      if (disableCopy) {
        onChange?.(); // if its the first time its created, we dont call onChange
      }
      setBackendClientId(editedBackendClientId);
      setEditMode(false);
      setSaving(false);
    };

    const handleCancel = () => {
      setEditedBackendClientId(backendClientId);
      setEditMode(false);
    };

    const supportedTypeMap: Record<string, string> = {
      slackConnector: 'slack',
    };
    const componentMap =
      integrationData?.data.data?.components
        ?.map((component) => supportedTypeMap[component.name])
        .filter((type) => !!type)
        .reduce<Record<string, string>>((acc, cur) => {
          acc[cur] = integrationData?.data.id;
          return acc;
        }, {}) || {};
    const isSampleAppEnabled = !!Object.keys(componentMap).length;

    return deleteModalOpen ? (
      <DeleteBackendModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onConfirm={() => onDelete({ isApplication: true, id })}
      />
    ) : (
      <SC.Card open={open} ref={ref} tabIndex={-1}>
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
          <SC.SmallTitleWrapper>
            <SC.SmallTitle>
              <strong>Integration Base URL:</strong> {integrationBaseUrl}
            </SC.SmallTitle>
            <CSC.Copy onClick={() => handleCopy(integrationBaseUrl as string)} margin="0 0 0 20px" />
            <SC.CopySuccess copy={copiedLine}>Copied to clipboard!</SC.CopySuccess>
          </SC.SmallTitleWrapper>

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
              onClick={() => setDeleteModalOpen(true)}
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
      </SC.Card>
    );
  }
);

export default Connect;
