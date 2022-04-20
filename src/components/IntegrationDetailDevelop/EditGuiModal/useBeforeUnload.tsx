import { useEffect } from 'react';

type Props = {
  isEditorRunning: boolean;
  isDirty: boolean;
};

const handleBeforeUnload = (e: BeforeUnloadEvent, isDirty: boolean) => {
  if (isDirty) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set

    e.returnValue = '';
  }
};

const useBeforeUnload = ({ isEditorRunning, isDirty }: Props) => {
  useEffect(() => {
    if (isEditorRunning) {
      window.addEventListener('beforeunload', (e) => handleBeforeUnload(e, isDirty));
    }

    return () => window.removeEventListener('beforeunload', (e) => handleBeforeUnload(e, isDirty));
  }, [isEditorRunning, isDirty]);
};

export default useBeforeUnload;
