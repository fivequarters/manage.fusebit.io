import { useEffect } from 'react';

const useTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | Fusebit`;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useTitle;
