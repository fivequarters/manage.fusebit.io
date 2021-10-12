import React, { useRef } from 'react';
import TabComponent from '../common/TabComponent';
import ConnectorsTable from './ConnectorsTable';

const ConnectorsOverview: React.FC = () => {
  const headless = useRef(true); // the parent has to have this otherwise the mounting of the overview will open the feed picker if there is a query param.
  return (
    <TabComponent
      tabNames={['Overview']}
      tabObjects={[
        <ConnectorsTable
          key="connectorsTable"
          headless={!!headless}
          setHeadless={(value: boolean) => {
            headless.current = value;
          }}
        />,
      ]}
    />
  );
};

export default ConnectorsOverview;
