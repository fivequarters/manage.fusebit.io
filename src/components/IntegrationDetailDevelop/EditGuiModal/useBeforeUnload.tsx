import { IS_EDITOR_SAVING_KEY } from '@utils/constants';
import { useCallback, useEffect, useRef } from 'react';

type Props = {
  isEditorRunning: boolean;
  isSaving: boolean;
};

const useBeforeUnload = ({ isEditorRunning, isSaving }: Props) => {
  const cancelPrompt = useRef(false);

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if ((window.editor?.dirtyState && !cancelPrompt.current) || isSaving) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set

        e.returnValue = '';
      }
    },
    [isSaving]
  );

  useEffect(() => {
    if (isEditorRunning) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditorRunning, handleBeforeUnload]);

  useEffect(() => {
    cancelPrompt.current = isSaving;
    localStorage.setItem(IS_EDITOR_SAVING_KEY, `${isSaving}`);

    return () => localStorage.removeItem(IS_EDITOR_SAVING_KEY);
  }, [isSaving]);
};

export default useBeforeUnload;
