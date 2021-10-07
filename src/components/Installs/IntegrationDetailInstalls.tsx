import React from 'react';
import { useGetRedirectLink } from '../../hooks/useGetRedirectLink';
import TabComponent from '../TabComponent';
import Installs from './Installs';
import { Props } from '../../interfaces/integration';

const IntegrationDetailInstalls: React.FC<Props> = ({ id }) => {
  const { getRedirectLink } = useGetRedirectLink();
  return (
    <TabComponent
      tabNames={['Develop', 'Installs']}
      tabObjects={[getRedirectLink(`/integration/${id}/develop`), <Installs key="installs" />]}
    />
  );
};

export default IntegrationDetailInstalls;
