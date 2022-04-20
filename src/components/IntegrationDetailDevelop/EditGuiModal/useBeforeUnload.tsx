import { useEffect } from 'react';

type Props = {
  isEditorRunning: boolean;
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (window.editor?.dirtyState) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set

    e.returnValue = '';
  }
};

const useBeforeUnload = ({ isEditorRunning }: Props) => {
  useEffect(() => {
    if (isEditorRunning) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditorRunning]);
};

export default useBeforeUnload;
