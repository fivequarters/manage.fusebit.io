import { Backdrop, Modal, Fade } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useBackendClient } from '../../../hooks/useBackendClient';
import { Entity } from '../../../interfaces/feed';
import Connect from '../Connect';

interface Props {
  open: boolean;
  onClose: () => void;
  backendClient: any;
  integrationData?: any;
}

const AddBackendModal = ({ open, onClose, backendClient, integrationData }: Props) => {
  const [showWarning, setShowWarning] = useState(false);
  const [keyIsCopied, setKeyIsCopied] = useState(false);
  const { removeBackendClientListener } = useBackendClient();

  const handleCloseWithWarning = async () => {
    if (keyIsCopied || showWarning) {
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

  const handleDelete = async (connector: Entity) => {
    await removeBackendClientListener(connector.id);
    // await getBackendClients();

    onClose();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <Connect
          onDelete={handleDelete}
          name={backendClient?.name || ''}
          id={backendClient?.id || ''}
          //   onChange={getBackendClients}
          onChange={() => {}}
          token={backendClient?.token || ''}
          showWarning={showWarning}
          setShowWarning={setShowWarning}
          keyIsCopied={keyIsCopied}
          setKeyIsCopied={setKeyIsCopied}
          open={open}
          onClose={handleCloseWithWarning}
          integration={integrationData?.data}
        />
      </Fade>
    </Modal>
  );
};

export default AddBackendModal;
