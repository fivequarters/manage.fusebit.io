import React from 'react';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import TabComponent from '../../TabComponent';
import IdentitiesTable from './IdentitiesTable/IdentitiesTable';
import { Props } from '../../../interfaces/connector';

const ConnectorDetailIdentities: React.FC<Props> = ({ id }) => {
  const { getRedirectLink } = useGetRedirectLink();

  return (
    <TabComponent
      tabNames={['Configure', 'Identities']}
      tabObjects={[getRedirectLink(`/connector/${id}/configure`), <IdentitiesTable />]}
    />
  );
};

export default ConnectorDetailIdentities;
