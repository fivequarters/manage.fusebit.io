import React from 'react';
import { useContext } from '../../../../hooks/useContext';
import { useAccountConnectorsGetAll } from '../../../../hooks/api/v2/account/connector/useGetAll';
import { Connector } from '../../../../interfaces/connector';
import { OverviewProps } from '../../../../interfaces/connectors';
import { ConnectorCells } from '../../../../interfaces/tableRow';
import TableComponent from '../../../TableComponent';

const Overview: React.FC<OverviewProps> = ({ headless, setHeadless }) => {
  const { userData } = useContext();
  const { data: connectors, refetch: reloadConnectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
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
    <TableComponent
      connectorTable={true}
      headless={headless}
      setHeadless={setHeadless}
      connectors={connectors}
      reloadConnectors={reloadConnectors}
      selectedCell={selectedCell}
      handleNextCellSelect={handleNextCellSelect}
      handlePreviousCellSelect={handlePreviousCellSelect}
    />
  );
};

export default Overview;
