import { useCallback } from 'react';
import { useXarrow } from 'react-xarrows';

// Workaround to reat-xarrows issue

const useUpdateLineConnectors = () => {
  const updateXarrow = useXarrow();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(() => updateXarrow, []);
};

export default useUpdateLineConnectors;
