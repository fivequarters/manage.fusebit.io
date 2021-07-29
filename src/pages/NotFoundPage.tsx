import React, { FC, ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "../hooks/useContext";

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { userData } = useContext();

  useEffect(() => {
    const firstLoginRedirect = localStorage.getItem("redirect"); //if there is something here it means that the user logged in for the first time and wants to go to this link, so we send him there
    const refreshToken = localStorage.getItem("refreshToken"); //if the user refreshed the token it returns true
    const refreshTokenUrl = localStorage.getItem("refreshTokenUrl"); //the refreshTokenUrl we should redirect to
    console.log(firstLoginRedirect);
    if (firstLoginRedirect !== null) {
      localStorage.removeItem("redirect");
      history.push(firstLoginRedirect);
    } else if (refreshToken === "true" && refreshTokenUrl) {
        history.push(refreshTokenUrl);
    } else if (userData.accountId !== undefined && userData.subscriptionId !== undefined) {
      history.push("/" + userData.accountId + "/" + userData.subscriptionId + "/integrations");
    }
  }, [history, userData]);

  return (
    <></>
  );
};

export default NotFoundPage;
