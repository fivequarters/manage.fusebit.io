import React from 'react';
import TabComponent from '../TabComponent';
import Configure from './Configure';

const ConnectorDetail: React.FC = () => {
  return <TabComponent tabNames={['Configure']} tabObjects={[<Configure />]} />;
};

export default ConnectorDetail;
