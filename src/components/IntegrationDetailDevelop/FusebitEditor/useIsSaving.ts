import { useEffect, useState } from 'react';
import { EditorEvents } from '../../../enums/editor';

interface Props {
  isMounted: boolean;
}

const useIsSaving = ({ isMounted }: Props) => {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isMounted) {
      window.editor?.on(EditorEvents.BuildStarted, () => setIsSaving(true));
      window.editor?.on(EditorEvents.BuildFinished, () => setIsSaving(false));
      window.editor?.on(EditorEvents.BuildError, () => setIsSaving(false));
    }
  }, [isMounted, isSaving]);

  return isSaving;
};

export default useIsSaving;
