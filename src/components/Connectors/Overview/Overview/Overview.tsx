import React from 'react';
import { useContext } from '../../../../hooks/useContext';
import { useAccountConnectorsGetAll } from '../../../../hooks/api/v2/account/connector/useGetAll';
import { Connector } from '../../../../interfaces/connector';
import { ConnectorCells } from '../../../../interfaces/tableRow';
import TableComponent from '../../../TableComponent';
import ConnectorsTable from '../../ConnectorsTable/ConnectorsTable';

interface Props {
  headless: boolean;
  setHeadless: (value: boolean) => void;
}

const Overview: React.FC<Props> = ({ headless, setHeadless }) => {
  const { userData } = useContext();
  const { data: connectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const [selectedCell, setSelectedCell] = React.useState<ConnectorCells>(ConnectorCells.TYPE);

  const handlePreviousCellSelect = () => {
    if (selectedCell === ConnectorCells.TYPE) {
      setSelectedCell(ConnectorCells.IDENTITIES);
    } else {
      setSelectedCell(ConnectorCells.TYPE);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === ConnectorCells.TYPE) {
      setSelectedCell(ConnectorCells.IDENTITIES);
    } else {
      setSelectedCell(ConnectorCells.TYPE);
    }
  };

  return (
    <>
      <ConnectorsTable headless={headless} setHeadless={setHeadless} />
      <TableComponent
        connectorTable
        headless={headless}
        setHeadless={setHeadless}
        connectors={connectors}
        selectedCell={selectedCell}
        handleNextCellSelect={handleNextCellSelect}
        handlePreviousCellSelect={handlePreviousCellSelect}
      />
    </>
  );
};

export default Overview;
