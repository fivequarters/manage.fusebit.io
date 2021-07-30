import React, { FC, ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "../hooks/useContext";
import { useGetRedirectLink } from "../hooks/useGetRedirectLink";

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { userData } = useContext();
  const {getRedirectLink} = useGetRedirectLink();

  useEffect(() => {
    const firstLoginRedirect = localStorage.getItem("redirect"); //if there is something here it means that the user logged in for the first time and wants to go to this link, so we send him there
    const refreshToken = localStorage.getItem("refreshToken"); //if the user refreshed the token it returns true
    const refreshTokenUrl = localStorage.getItem("refreshTokenUrl"); //the refreshTokenUrl we should redirect to
    if (firstLoginRedirect !== null) {
      localStorage.removeItem("redirect");
      history.push(firstLoginRedirect);
    } else if (refreshToken === "true" && refreshTokenUrl) {
        history.push(refreshTokenUrl);
    } else if (userData.accountId !== undefined && userData.subscriptionId !== undefined) {
      history.push(getRedirectLink("/integrations"));
    }
  }, [history, userData, getRedirectLink]);

  return (
    <></>
  );
};

export default NotFoundPage;
