import { useEffect, useState } from 'react';
import { EditorEvents } from '../../../enums/editor';

interface Props {
  isMounted: boolean;
}

const useEditorEvents = ({ isMounted }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [errorBuild, setErrorBuild] = useState('');

  useEffect(() => {
    if (isMounted) {
      window.editor?.on(EditorEvents.BuildStarted, () => {
        setIsSaving(true);
        setErrorBuild('');
      });
      window.editor?.on(EditorEvents.BuildFinished, () => setIsSaving(false));
      window.editor?.on(EditorEvents.BuildError, (e: { error: { message: string } }) => {
        setIsSaving(false);
        setErrorBuild(`There was an error in the build: ${e.error.message}`);
      });
    }
  }, [isMounted, isSaving]);

  return {
    isSaving,
    errorBuild,
    setErrorBuild,
  };
};

export default useEditorEvents;
