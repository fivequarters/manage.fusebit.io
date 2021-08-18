import React, { FC, ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useContext } from '../hooks/useContext';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { userData } = useContext();
  const { getRedirectLink } = useGetRedirectLink();

  useEffect(() => {
    const integrationsContract = localStorage.getItem('integrationsContract'); //if there is something here it means that the user logged in for the first time and wants to create the integrations template associated with this key
    const connectorsContract = localStorage.getItem('connectorsContract'); //if there is something here it means that the user logged in for the first time and wants to create the connectors template associated with this key
    const refreshToken = localStorage.getItem('refreshToken'); //if the user refreshed the token it returns true
    const refreshTokenUrl = localStorage.getItem('refreshTokenUrl'); //the refreshTokenUrl we should redirect to
    if (integrationsContract !== null) {
      localStorage.removeItem('integrationsContract');
      history.push(getRedirectLink('/integrations/overview' + integrationsContract));
    } else if (connectorsContract !== null) {
      localStorage.removeItem('connectorsContract');
      history.push(getRedirectLink('/connectors/overview' + connectorsContract));
    } else if (refreshToken === 'true' && refreshTokenUrl) {
      history.push(refreshTokenUrl);
    } else if (userData.accountId !== undefined && userData.subscriptionId !== undefined) {
      history.push(getRedirectLink('/integrations/overview'));
    }
  }, [history, userData, getRedirectLink]);

  return <></>;
};

export default NotFoundPage;
