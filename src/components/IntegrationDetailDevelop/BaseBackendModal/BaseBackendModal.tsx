import Modal from '@components/common/Modal';
import Connect from '@components/IntegrationDetailDevelop/ConnectModal';
import useDeleteBackend from '@components/IntegrationDetailDevelop/hooks/useDeleteBackend';

interface Props extends Omit<React.ComponentProps<typeof Connect>, 'onDelete'> {
  open: boolean;
  onClose: (force?: boolean) => void;
}

const BaseBackendModal = ({ open, onClose, id, ...props }: Props) => {
  const { handleDelete } = useDeleteBackend({ onClose: () => onClose(true), id });

  return (
    <Modal open={open} onClose={() => onClose()}>
      <Connect open={open} onClose={() => onClose()} onDelete={handleDelete} id={id} {...props} />
    </Modal>
  );
};

export default BaseBackendModal;
