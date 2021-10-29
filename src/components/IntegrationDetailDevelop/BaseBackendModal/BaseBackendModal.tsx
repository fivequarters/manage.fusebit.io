import { Backdrop, Modal, Fade, useMediaQuery, Drawer } from '@material-ui/core';
import { useState } from 'react';
import styled from 'styled-components';
import Connect from '../Connect';
import DeleteBackendModal from '../DeleteBackendModal';
import useDeleteBackend from '../hooks/useDeleteBackend';

interface Props extends Omit<React.ComponentProps<typeof Connect>, 'onDelete'> {
  open: boolean;
  onClose: (force?: boolean) => void;
}

export const StyledCard = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 40px 96px;
  border-radius: 8px;
  width: 859px;
  height: 700px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

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
          <Connect open={open} onClose={() => onClose()} onDelete={() => setDeleteModalOpen(true)} id={id} {...props} />
        </Drawer>
      );
    }

    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => onClose()}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={open}>
          <StyledCard open={open} tabIndex={-1}>
            <Connect
              open={open}
              onClose={() => onClose()}
              onDelete={() => setDeleteModalOpen(true)}
              id={id}
              {...props}
            />
          </StyledCard>
        </Fade>
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
