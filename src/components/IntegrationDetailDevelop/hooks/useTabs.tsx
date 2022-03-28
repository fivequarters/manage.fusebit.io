import { useMemo, useState } from 'react';
import styled from 'styled-components';

const StyledTabsWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  width: 100%;
  background: #e6eeff;
  border-radius: 0px 4px 0px 0px;
`;

const useTabs = () => {
  const [tabs, setTabs] = useState<string[]>([]);

  const tabsElement = useMemo(() => {
    const tabsJsxArray = tabs.map((tab) => {
      return <StyledTabsWrapper key={tab}>{tab}</StyledTabsWrapper>;
    });

    return <div>{tabsJsxArray}</div>;
  }, [tabs]);

  const addTab = (newTab: string) => {
    const isAdded = tabs.find((tab) => tab === newTab);

    if (!isAdded) {
      setTabs([...tabs, newTab]);
    }
  };

  return {
    addTab,
    tabsElement,
  };
};

export default useTabs;
