import React, { FC, ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";

const NotFoundPage: FC<{}> = (): ReactElement => {
  const history = useHistory();

  useEffect(() => history.push("/"), [history]);

  return (
    <></>
  );
};

export default NotFoundPage;
