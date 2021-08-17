import React from 'react';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import TabComponent from '../../TabComponent';
import Develop from './Develop/Develop';
import { Props } from '../../../interfaces/integration';

const IntegrationDetailDevelop: React.FC<Props> = ({ id }) => {
  const { getRedirectLink } = useGetRedirectLink();
  return (
    <TabComponent
      tabNames={['Develop', 'Installs']}
      tabObjects={[<Develop />, getRedirectLink('/integration/' + id + '/installs')]}
    />
  );
};

export default IntegrationDetailDevelop;
