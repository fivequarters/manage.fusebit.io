import React from 'react';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import TabComponent from '../../TabComponent';
// import Identities from './Identities';
import { Props } from '../../../interfaces/connector';
import Identities from './Identities';

const ConnectorDetailIdentities: React.FC<Props> = ({ id }) => {
  const { getRedirectLink } = useGetRedirectLink();

  return (
    <TabComponent
      tabNames={['Configure', 'Identities']}
      tabObjects={[getRedirectLink('/connector/' + id + '/configure'), <Identities />]}
    />
  );
};

export default ConnectorDetailIdentities;
