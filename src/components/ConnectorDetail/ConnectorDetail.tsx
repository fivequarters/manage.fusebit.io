import React from 'react';
import TabComponent from '../TabComponent';
import Configure from './Configure';
import Identities from './Identities';

const ConnectorDetail: React.FC = () => {
  return <TabComponent tabNames={['Configure', 'Identities']} tabObjects={[<Configure />, <Identities />]} />;
};

export default ConnectorDetail;
