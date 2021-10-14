import { useEffect } from 'react';

interface Props<T> {
  entities?: T[];
  onFirstTimeVisitor?: () => void;
}

const useFirstTimeVisitor = <T = unknown>({ entities, onFirstTimeVisitor } = {} as Props<T>) => {
  const isFirstTimeVisitor = () => localStorage.getItem('firstTimeVisitor') === 'true';
  const setFirstTimeVisitor = (firstTime: boolean) =>
    localStorage.setItem('firstTimeVisitor', firstTime ? 'true' : 'false');

  useEffect(() => {
    if (!entities) {
      return;
    }

    if (entities.length > 0) {
      setFirstTimeVisitor(false);
    } else if (isFirstTimeVisitor()) {
      onFirstTimeVisitor?.();
      setFirstTimeVisitor(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities]);

  return {
    isFirstTimeVisitor,
    setFirstTimeVisitor,
  };
};

export default useFirstTimeVisitor;
