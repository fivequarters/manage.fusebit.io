import React from 'react';
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';
import ListItem from '../ListItem';
import { useModal } from '../../../hooks/useModal';
import ExistingBackendModal from '../ExistingBackendModal';
import { BackendClient } from '../../../interfaces/backendClient';
import useDeleteBackend from '../hooks/useDeleteBackend';
import DeleteBackendModal from '../DeleteBackendModal';

interface Props {
  className?: string;
  backend: BackendClient;
}

const BackendItem: React.FC<Props> = ({ className, backend }) => {
  const [existingBackendOpen, setExistingBackendModal, toggleExistingBackend] = useModal();
  const [deleteBackendModalOpen, setDeleteBackendModal, toggleDeleteBackendModal] = useModal();
  const { handleDelete } = useDeleteBackend({ onClose: () => setDeleteBackendModal(false), id: backend.id });

  return (
    <>
      <DeleteBackendModal open={deleteBackendModalOpen} setOpen={setDeleteBackendModal} onConfirm={handleDelete} />
      <ExistingBackendModal
        backendClient={backend}
        open={existingBackendOpen}
        onClose={() => setExistingBackendModal(false)}
      />
      <ListItem
        onClick={toggleExistingBackend}
        className={className}
        icon={<DnsOutlinedIcon />}
        name={backend.name}
        onDelete={toggleDeleteBackendModal}
      />
    </>
  );
};

export default BackendItem;
