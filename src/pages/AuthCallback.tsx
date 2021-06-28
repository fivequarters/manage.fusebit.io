import React, { FC, ReactElement } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useContext } from "../hooks/useContext";
import { useAccountUserGetOne } from "../hooks/api/v1/account/user/useGetOne";
import { User } from "../interfaces/user";

const IntegrationsPage: FC<{}> = (): ReactElement => {

  const location = useLocation();
  const history = useHistory();
  const { auth, userData } = useContext();
  const { data: user } = useAccountUserGetOne<User>({ enabled: userData.token, accountId: userData.accountId, userId: userData.userId });

  useEffect(() => {
    if (user) {
      auth({ 
        ...userData, 
        id: user?.data.id, 
        firstName: user?.data.firstName, 
        lastName: user?.data.lastName, 
        primaryEmail: user?.data.primaryEmail 
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (userData.id) history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.hash.substring(1));
    const token = urlParams.get('access_token') || "";
    const decoded = jwt_decode<{ 'https://fusebit.io/profile': { accountId: string; subscriptionId: string; userId: string } }>(token);
    auth({ token, ...decoded['https://fusebit.io/profile']});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <></>
  );
};

export default IntegrationsPage;
