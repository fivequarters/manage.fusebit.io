import React, { useRef } from 'react';
import TabComponent from '../common/TabComponent';
import IntegrationsTable from './IntegrationsTable/IntegrationsTable';

const IntegrationsOverview: React.FC = () => {
  const headless = useRef(true); // the parent has to have this otherwise the mounting of the overview will open the feed picker if there is a query param.

  return (
    <TabComponent
      tabNames={['Overview']}
      tabObjects={[
        <IntegrationsTable
          key="integrationsTable"
          headless={!!headless}
          setHeadless={(value: boolean) => {
            headless.current = value;
          }}
        />,
      ]}
    />
  );
};

export default IntegrationsOverview;
