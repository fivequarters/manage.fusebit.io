import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import { useCopy } from '../../../hooks/useCopy';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { useAccountIntegrationsGetOne } from '../../../hooks/api/v2/account/integration/useGetOne';
import { useBackendUpdateOne } from '../../../hooks/api/v1/backend/useUpdateOne';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export interface Props {
  onClose: Function;
  onChange?: () => void;
  id: string;
  name: string;
  keyIsCopied?: boolean;
  showWarning?: boolean;
  setShowWarning?: Function;
  disableCopy?: boolean;
}

const useConnect = ({ onClose, disableCopy, keyIsCopied, showWarning, name, setShowWarning, onChange, id }: Props) => {
  const { id: integrationId } = useParams<{ id: string }>();
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useAuthContext();
  const [editMode, setEditMode] = useState(false);
  const [editedBackendClientId, setEditedBackendClientId] = useState(name);
  const [backendClientId, setBackendClientId] = useState(name);
  const { handleCopy, copiedLine } = useCopy();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const buttonsCrashing = useMediaQuery('(max-width: 665px)');
  const smallPhone = useMediaQuery('(max-width: 360px)');

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

  const connectYourBackendButtonsSize = () => {
    if (smallPhone && isSampleAppEnabled) {
      return 'small';
    }

    if (buttonsCrashing) {
      return 'medium';
    }

    return 'large';
  };

  const deleteAndOkButtonsWidth = () => {
    if (smallPhone) {
      return '136px';
    }

    if (buttonsCrashing) {
      return '156px';
    }

    return '200px';
  };

  const timeDescriptionWidth = () => {
    if (smallPhone) {
      return '140px';
    }

    if (buttonsCrashing) {
      return '165px';
    }

    return '100%';
  };

  return {
    isSampleAppEnabled,
    integrationBaseUrl,
    integrationData,
    integrationId,
    componentMap,
    handleClose,
    handleSave,
    handleCancel,
    handleCopy,
    copiedLine,
    editMode,
    backendClientId,
    editedBackendClientId,
    setEditedBackendClientId,
    setEditMode,
    setBackendClientId,
    deleteModalOpen,
    setDeleteModalOpen,
    saving,
    buttonsCrashing,
    smallPhone,
    connectYourBackendButtonsSize,
    deleteAndOkButtonsWidth,
    timeDescriptionWidth,
  };
};

export default useConnect;
