import { useLoader } from '@hooks/useLoader';

type Props = {
  isEditorRunning: boolean;
};

const useEditorLoader = ({ isEditorRunning }: Props) => {
  const { createLoader, removeLoader } = useLoader();

  if (isEditorRunning) {
    removeLoader();
  } else {
    createLoader();
  }
};

export default useEditorLoader;
