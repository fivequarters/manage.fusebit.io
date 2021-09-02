import React from 'react';
import * as SC from './styles';
import * as CSC from '../globalStyle';
import { TableCell, Checkbox } from '@material-ui/core';
import { Props, ConnectorCells, IntegrationCells, UserCells } from '../../interfaces/tableRow';
import { useGetRedirectLink } from '../../hooks/useGetRedirectLink';
import { useContext } from '../../hooks/useContext';
import client from '../../assets/client.jpg';
import { useAccountConnectorIdentityGetAll } from '../../hooks/api/v2/account/connector/identity/useGetAll';
import { useAccountIntegrationInstanceGetAll } from '../../hooks/api/v2/account/integration/instance/useGetAll';
import { Identity } from '../../interfaces/identities';
import { Install } from '../../interfaces/install';

const TableRowComponent: React.FC<Props> = ({
  row,
  handleRowClick,
  handleCheck,
  isSelected,
  mobile,
  selectedCell,
  integrationsTable,
  connectorsTable,
}) => {
  const { getRedirectLink } = useGetRedirectLink();
  const { userData } = useContext();
  const { data: identitiesData } = useAccountConnectorIdentityGetAll<Identity>({
    enabled: userData.token,
    id: row.id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { data: installsData } = useAccountIntegrationInstanceGetAll<Install>({
    enabled: userData.token,
    id: row.id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const handleClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    handleRowClick(
      e,
      integrationsTable
        ? getRedirectLink('/integration/' + row.id + '/develop')
        : connectorsTable
        ? getRedirectLink('/connector/' + row.id + '/configure')
        : getRedirectLink('/authentication/' + row.id + '/overview')
    );
  };

  if (!mobile) {
    return (
      <SC.Row key={row.id} onClick={(e) => handleClick(e)}>
        <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
          <Checkbox
            color="primary"
            onClick={(event) => handleCheck(event, row.id)}
            checked={isSelected(row.id)}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
            id={`enhanced-table-checkbox-${row.id}`}
          />
        </TableCell>
        {integrationsTable || connectorsTable ? (
          <TableCell component="th" scope="row">
            <SC.CellName>{row.id}</SC.CellName>
          </TableCell>
        ) : (
          <TableCell>
            <SC.Flex>
              <SC.CellImage
                src={userData.userId === row.id ? userData.picture : client}
                alt="user"
                height="38"
                width="38"
              />
              <SC.CellName>
                {row.firstName && row.firstName} {row.lastName}
              </SC.CellName>
              {userData.userId === row.id && <SC.CellNameDetail>[me]</SC.CellNameDetail>}
            </SC.Flex>
          </TableCell>
        )}
        {connectorsTable && (
          <TableCell align="left">{row.tags ? row.tags['fusebit.provider'] : <CSC.Spinner />}</TableCell>
        )}
        {integrationsTable || connectorsTable ? (
          <TableCell align="left">
            {integrationsTable ? (
              installsData?.data.total !== undefined ? (
                installsData?.data.total
              ) : (
                <CSC.Spinner />
              )
            ) : identitiesData?.data.total !== undefined ? (
              identitiesData?.data.total
            ) : (
              <CSC.Spinner />
            )}
          </TableCell>
        ) : (
          <>
            <TableCell component="th" scope="row">
              {row.primaryEmail}
            </TableCell>
            <TableCell component="th" scope="row">
              {row.id}
            </TableCell>
          </>
        )}
      </SC.Row>
    );
  } else {
    return (
      <SC.Row key={row.id} onClick={(e) => handleClick(e)}>
        <TableCell style={{ cursor: 'default' }} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
          <Checkbox
            color="primary"
            onClick={(event) => handleCheck(event, row.id)}
            checked={isSelected(row.id)}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
            id={`enhanced-table-checkbox-${row.id}`}
          />
        </TableCell>
        {(integrationsTable || connectorsTable) && (
          <TableCell component="th" scope="row">
            <SC.CellName>{row.id}</SC.CellName>
          </TableCell>
        )}
        <TableCell align="left">
          {integrationsTable ? (
            selectedCell === IntegrationCells.INSTALLS && installsData?.data.total !== undefined ? (
              installsData?.data.total
            ) : (
              <CSC.Spinner />
            )
          ) : connectorsTable ? (
            selectedCell === ConnectorCells.TYPE ? (
              row.tags ? (
                row.tags['fusebit.provider']
              ) : (
                <CSC.Spinner />
              )
            ) : identitiesData?.data.total !== undefined ? (
              identitiesData?.data.total
            ) : (
              <CSC.Spinner />
            )
          ) : selectedCell === UserCells.EMAIL ? (
            row.primaryEmail
          ) : selectedCell === UserCells.NAME ? (
            <SC.Flex>
              <SC.CellImage
                src={userData.userId === row.id ? userData.picture : client}
                alt="user"
                height="38"
                width="38"
              />
              <SC.CellName>
                {row.firstName} {row.lastName}
              </SC.CellName>
            </SC.Flex>
          ) : (
            row.id
          )}
        </TableCell>
      </SC.Row>
    );
  }
};

export default TableRowComponent;
