import React, { FC, ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "../hooks/useContext";

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { userData } = useContext();

  useEffect(() => {
    const res = localStorage.getItem("refreshToken"); //if the user refreshed the token it returns true
    const url = localStorage.getItem("refreshTokenUrl"); //the url we should redirect to
    if (res === "true" && url) {
        history.push(url);
    } else if (userData.accountId !== undefined && userData.subscriptionId !== undefined) {
      history.push("/" + userData.accountId + "/" + userData.subscriptionId + "/integrations");
    }
  }, [history, userData]);

  return (
    <></>
  );
};

export default NotFoundPage;
