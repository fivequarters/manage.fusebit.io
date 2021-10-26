import React from 'react';
import DnsOutlinedIcon from '@material-ui/icons/DnsOutlined';
import { useMediaQuery } from '@material-ui/core';
import ListItem from '../ListItem';
import { useModal } from '../../../hooks/useModal';
import ExistingBackendModal from '../ExistingBackendModal';
import { BackendClient } from '../../../interfaces/backendClient';
import useDeleteBackend from '../hooks/useDeleteBackend';
import DeleteBackendModal from '../DeleteBackendModal';
import LineConnector from '../../common/LineConnector';
import { INTEGRATION_CARD_ID } from '../IntegrationCard/IntegrationCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '../constants';

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
