import { useBackendDeleteOne } from '@hooks/api/v1/backend/useDeleteOne';
import { useLoader } from '@hooks/useLoader';

interface Props {
  onClose: () => void;
  id: string;
}

const useDeleteBackend = ({ onClose, id }: Props) => {
  const { mutateAsync } = useBackendDeleteOne();
  const { createLoader, removeLoader } = useLoader();

  const handleDelete = async () => {
    createLoader();

    onClose();

    await mutateAsync(id);

    removeLoader();
  };

  return {
    handleDelete,
  };
};

export default useDeleteBackend;
