import React from 'react';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import TabComponent from '../../common/TabComponent';
import Configure from './Configure';
import { Props } from '../../../interfaces/connector';

const ConnectorDetailConfigure: React.FC<Props> = ({ id }) => {
  const { getRedirectLink } = useGetRedirectLink();
  return (
    <TabComponent
      tabNames={['Configure', 'Identities']}
      tabObjects={[<Configure key="configure" />, getRedirectLink(`/connector/${id}/identities`)]}
    />
  );
};

export default ConnectorDetailConfigure;
