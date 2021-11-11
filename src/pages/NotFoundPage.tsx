import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import * as CSC from '@components/globalStyle';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import useTitle from '@hooks/useTitle';

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { userData } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const [showLoader, setShowLoader] = useState(false);
  const location = useLocation();
  useTitle('Page Not Found');

  useEffect(() => {
    if (location.pathname === '/') {
      setShowLoader(true);
    }

    const integrationsContract = localStorage.getItem('integrationsContract'); // if there is something here it means that the user logged in for the first time and wants to create the integrations template associated with this key
    const connectorsContract = localStorage.getItem('connectorsContract'); // if there is something here it means that the user logged in for the first time and wants to create the connectors template associated with this key
    if (integrationsContract !== null) {
      localStorage.removeItem('integrationsContract');
      history.push(getRedirectLink(`/integrations/overview${integrationsContract}`));
    } else if (connectorsContract !== null) {
      localStorage.removeItem('connectorsContract');
      history.push(getRedirectLink(`/connectors/overview${connectorsContract}`));
    } else if (userData.accountId && userData.subscriptionId && userData.token) {
      history.push(getRedirectLink(`/integrations/overview${location.search}`));
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
