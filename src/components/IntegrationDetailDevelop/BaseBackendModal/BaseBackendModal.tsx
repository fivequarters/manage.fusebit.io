import { useMediaQuery, Drawer } from '@material-ui/core';
import { useState } from 'react';
import styled from 'styled-components';
import DeleteBackendModal from '@components/IntegrationDetailDevelop/DeleteBackendModal';
import Connect from '@components/IntegrationDetailDevelop/Connect';
import useDeleteBackend from '@components/IntegrationDetailDevelop/hooks/useDeleteBackend';
import Modal from '@components/common/Modal';

interface Props extends Omit<React.ComponentProps<typeof Connect>, 'onDelete'> {
  open: boolean;
  onClose: (force?: boolean) => void;
}

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 15px 40px;
  border-radius: 8px;

  @media only screen and (max-width: 870px) {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 32px;
    padding-top: 200px;
    left: 0;
    top: auto;
    bottom: 0;
    border-radius: 0;
    transform: translate(0, 0);
  }
`;

const BaseBackendModal = ({ open, onClose, id, ...props }: Props) => {
  const { handleDelete } = useDeleteBackend({ onClose: () => onClose(true), id });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 880px)');

  const renderContent = () => {
    if (isMobile) {
      return (
        <Drawer anchor="bottom" open={open}>
          <Connect open={open} onClose={onClose} onDelete={() => setDeleteModalOpen(true)} id={id} {...props} />
        </Drawer>
      );
    }

    return (
      <Modal disableActions open={open} onClose={onClose}>
        <StyledCard tabIndex={-1}>
          <Connect open={open} onClose={onClose} onDelete={() => setDeleteModalOpen(true)} id={id} {...props} />
        </StyledCard>
      </Modal>
    );
  };

  return (
    <>
      {deleteModalOpen ? (
        <DeleteBackendModal open={deleteModalOpen} setOpen={setDeleteModalOpen} onConfirm={() => handleDelete()} />
      ) : (
        renderContent()
      )}
    </>
  );
};

export default BaseBackendModal;
