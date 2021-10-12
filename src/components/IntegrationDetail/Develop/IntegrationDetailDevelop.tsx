import React from 'react';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import TabComponent from '../../common/TabComponent';
import Develop from './Develop/Develop';
import { Props } from '../../../interfaces/integration';

const IntegrationDetailDevelop: React.FC<Props> = ({ id }) => {
  const { getRedirectLink } = useGetRedirectLink();
  return (
    <TabComponent
      tabNames={['Develop', 'Installs']}
      tabObjects={[<Develop key="develop" />, getRedirectLink(`/integration/${id}/installs`)]}
    />
  );
};

export default IntegrationDetailDevelop;
