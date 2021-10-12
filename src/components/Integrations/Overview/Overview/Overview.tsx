import React from 'react';
import { useContext } from '../../../../hooks/useContext';
import { useAccountIntegrationsGetAll } from '../../../../hooks/api/v2/account/integration/useGetAll';
import { Integration } from '../../../../interfaces/integration';
import { OverviewProps } from '../../../../interfaces/integrations';
import { IntegrationCells } from '../../../../interfaces/tableRow';
import TableComponent from '../../../TableComponent';

const Overview: React.FC<OverviewProps> = ({ headless, setHeadless }) => {
  const { userData } = useContext();
  const { data: integrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const [selectedCell, setSelectedCell] = React.useState<IntegrationCells>(IntegrationCells.INSTALLS);

  const handlePreviousCellSelect = () => {
    if (selectedCell === IntegrationCells.INSTALLS) {
      // setSelectedCell(IntegrationCells.DEPLOYED);
    } else if (selectedCell === IntegrationCells.CREATED) {
      setSelectedCell(IntegrationCells.INSTALLS); // uncommented to not leave the variable unused
    } else {
      // setSelectedCell(IntegrationCells.CREATED);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === IntegrationCells.INSTALLS) {
      // setSelectedCell(IntegrationCells.CREATED);
    } else if (selectedCell === IntegrationCells.CREATED) {
      // setSelectedCell(IntegrationCells.DEPLOYED);
    } else {
      // setSelectedCell(IntegrationCells.INSTALLS);
    }
  };

  return (
    <TableComponent
      integrationTable={true}
      headless={headless}
      setHeadless={setHeadless}
      integrations={integrations}
      selectedCell={selectedCell}
      handleNextCellSelect={handleNextCellSelect}
      handlePreviousCellSelect={handlePreviousCellSelect}
    />
  );
};

export default Overview;
