import React from 'react';
import TabComponent from '../../common/TabComponent';
import Overview from './Overview/Overview';

const AuthenticationDetail: React.FC = () => {
  return (
    <>
      <TabComponent tabNames={['Overview']} tabObjects={[<Overview key="overview" />]} />
    </>
  );
};

export default AuthenticationDetail;
