import { useQuery } from '@hooks/useQuery';
import { useCallback, useEffect, useState } from 'react';

const useEditorParams = () => {
  const [enableGrafanaLogs, setEnableGrafanaLogs] = useState(false);
  const query = useQuery();

  const searchAndSetParam = useCallback(
    (param: string, setter?: (val: boolean) => void) => {
      const disableParam = query.get(param) === 'false';
      if (disableParam) {
        localStorage.removeItem(param);
        setter?.(false);
      } else {
        const isParamFound = query.get(param) === 'true' || localStorage.getItem(param) === 'true';
        if (isParamFound) {
          localStorage.setItem(param, `${isParamFound}`);
          setter?.(true);
        }
      }
    },
    [query]
  );

  useEffect(() => {
    const params = [{ id: 'enableGrafanaLogs', setter: setEnableGrafanaLogs }, { id: 'disableSelfClose' }];

    params.forEach((param) => {
      searchAndSetParam(param.id, param?.setter);
    });
  }, [searchAndSetParam]);

  return {
    enableGrafanaLogs,
  };
};

export default useEditorParams;
