import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import useSampleApp from '@hooks/useSampleApp';
import { useCopy } from '../../../hooks/useCopy';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { useBackendUpdateOne } from '../../../hooks/api/v1/backend/useUpdateOne';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export interface Props {
  onClose: () => void;
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
  const [editMode, setEditMode] = useState(false);
  const [editedBackendClientId, setEditedBackendClientId] = useState(name);
  const [backendClientId, setBackendClientId] = useState(name);
  const { handleCopy, copiedLine } = useCopy();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const isMobile = useMediaQuery('(max-width: 880px)');
  const buttonsCrashing = useMediaQuery('(max-width: 665px)');
  const smallPhone = useMediaQuery('(max-width: 360px)');

  const integrationBaseUrl = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2${getRedirectLink(`/integration/${integrationId}`)}`;
  const { mutateAsync: updateBackend } = useBackendUpdateOne();

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

  return {
    integrationBaseUrl,
    integrationId,
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
    isMobile,
    ...useSampleApp(),
  };
};

export default useConnect;
