import { useState, useEffect } from 'react';
import { BackendClient } from '@interfaces/backendClient';
import BaseBackendModal from '@components/IntegrationDetailDevelop/BaseBackendModal';

interface Props {
  open: boolean;
  onClose: () => void;
  backendClient?: BackendClient;
}

const NewBackendModal = ({ open, onClose, backendClient }: Props) => {
  const [showWarning, setShowWarning] = useState(false);
  const [keyIsCopied, setKeyIsCopied] = useState(false);

  const handleCloseWithWarning = async (force?: boolean) => {
    if (force || keyIsCopied || showWarning) {
      onClose();
    } else {
      setShowWarning(true);
    }
  };

  useEffect(() => {
    return () => {
      setShowWarning(false);
      setKeyIsCopied(false);
    };
  }, [open]);

  return (
    <BaseBackendModal
      name={backendClient?.name || ''}
      id={backendClient?.id || ''}
      token={backendClient?.token || ''}
      showWarning={showWarning}
      setShowWarning={setShowWarning}
      keyIsCopied={keyIsCopied}
      setKeyIsCopied={setKeyIsCopied}
      open={open}
      onClose={handleCloseWithWarning}
    />
  );
};

export default NewBackendModal;
