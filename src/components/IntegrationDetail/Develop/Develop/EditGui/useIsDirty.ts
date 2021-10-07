import { useEffect, useState } from 'react';
import { EditorEvents } from '../../../../../enums/editor';

interface Props {
  isMounted: boolean;
}

const useIsDirty = ({ isMounted }: Props) => {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isMounted) {
      window.editor?.on(EditorEvents.DirtyStateChanged, () => setIsDirty(!isDirty));
    }
  }, [isMounted, isDirty]);

  return isDirty;
};

export default useIsDirty;
