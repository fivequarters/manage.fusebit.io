import React, { FC, ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "../hooks/useContext";

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();
  const { userData } = useContext();

  useEffect(() => {
    if (userData.accountId !== undefined && userData.subscriptionId !== undefined) {
      history.push("/" + userData.accountId + "/" + userData.subscriptionId + "/integrations");
    }
  }, [history, userData]);

  return (
    <></>
  );
};

export default NotFoundPage;
