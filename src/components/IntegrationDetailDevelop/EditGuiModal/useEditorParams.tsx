import { useEffect, useState } from 'react';

const searchAndSetParam = (param: string, setter?: (val: boolean) => void) => {
  const isParamFound = !!(window.location.search.includes(param) || localStorage.getItem(param));
  if (isParamFound) {
    localStorage.setItem(param, `${isParamFound}`);
    setter?.(isParamFound);
  }
};

const useEditorParams = () => {
  const [enableGrafanaLogs, setEnableGrafanaLogs] = useState(false);

  useEffect(() => {
    const params = [{ id: 'enableGrafanaLogs', setter: setEnableGrafanaLogs }, { id: 'disableSelfClose' }];

    params.forEach((param) => {
      searchAndSetParam(param.id, param?.setter);
    });
  }, []);

  return {
    enableGrafanaLogs,
  };
};

export default useEditorParams;
