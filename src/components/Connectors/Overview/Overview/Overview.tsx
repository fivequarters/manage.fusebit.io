import React from 'react';
import ConnectorsTable from '../../ConnectorsTable/ConnectorsTable';

interface Props {
  headless: boolean;
  setHeadless: (value: boolean) => void;
}

const Overview: React.FC<Props> = ({ headless, setHeadless }) => {
  return (
    <>
      <ConnectorsTable headless={headless} setHeadless={setHeadless} />
    </>
  );
};

export default Overview;
