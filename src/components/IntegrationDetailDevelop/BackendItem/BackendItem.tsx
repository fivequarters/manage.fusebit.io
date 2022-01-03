import React from 'react';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import { useMediaQuery } from '@mui/material';
import ListItem from '@components/IntegrationDetailDevelop/ListItem';
import { useModal } from '@hooks/useModal';
import ExistingBackendModal from '@components/IntegrationDetailDevelop/ExistingBackendModal';
import { BackendClient } from '@interfaces/backendClient';
import useDeleteBackend from '@components/IntegrationDetailDevelop/hooks/useDeleteBackend';
import DeleteBackendModal from '@components/IntegrationDetailDevelop/DeleteBackendModal';
import LineConnector from '@components/common/LineConnector';
import { INTEGRATION_CARD_ID } from '@components/IntegrationDetailDevelop/IntegrationCard/IntegrationCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '@components/IntegrationDetailDevelop/constants';

interface Props {
  className?: string;
  backend: BackendClient;
}

const BackendItem: React.FC<Props> = ({ className, backend }) => {
  const [existingBackendOpen, setExistingBackendModal, toggleExistingBackend] = useModal();
  const [deleteBackendModalOpen, setDeleteBackendModal, toggleDeleteBackendModal] = useModal();
  const { handleDelete } = useDeleteBackend({ onClose: () => setDeleteBackendModal(false), id: backend.id });
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);

  return (
    <>
      <DeleteBackendModal open={deleteBackendModalOpen} setOpen={setDeleteBackendModal} onConfirm={handleDelete} />
      <ExistingBackendModal
        backendClient={backend}
        open={existingBackendOpen}
        onClose={() => setExistingBackendModal(false)}
      />
      <ListItem
        id={backend.id}
        onClick={toggleExistingBackend}
        className={className}
        icon={<DnsOutlinedIcon style={{ color: 'var(--black)' }} />}
        name={backend.name}
        onDelete={toggleDeleteBackendModal}
      />
      {!matchesCardOverlapping && (
        <LineConnector start={backend.id} startAnchor="right" end={INTEGRATION_CARD_ID} endAnchor="left" />
      )}
    </>
  );
};

export default BackendItem;
