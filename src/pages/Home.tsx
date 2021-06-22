import React, { FC, ReactElement } from "react";
import Connectors from "../components/Connectors";
import Navbar from "../components/Navbar";

const Home: FC<{}> = (): ReactElement => {
  return (
    <>
      <Navbar />
      <Connectors />
    </>
  );
};

export default Home;
