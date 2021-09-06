import React, { FC, ReactElement, useEffect, useState } from 'react';
import * as CSC from '../components/globalStyle';
import { useHistory, useLocation } from 'react-router-dom';
import { useContext } from '../hooks/useContext';
import { useGetRedirectLink } from '../hooks/useGetRedirectLink';
import { handleTokenExpired, isTokenExpired } from '../utils/utils';

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { userData } = useContext();
  const { getRedirectLink } = useGetRedirectLink();
  const [showLoader, setShowLoader] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setShowLoader(true);
    }

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
    } else if (userData.accountId && userData.subscriptionId && userData.token) {
      const expired = isTokenExpired(userData.token);
      handleTokenExpired(expired);
      !expired && history.push(getRedirectLink('/integrations/overview'));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, userData, getRedirectLink, location]);

  return (
    <>
      {showLoader && (
        <CSC.BigSpinnerContainer>
          <CSC.BigSpinner />
        </CSC.BigSpinnerContainer>
      )}
    </>
  );
};

export default NotFoundPage;
