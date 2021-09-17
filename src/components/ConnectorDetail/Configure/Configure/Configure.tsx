import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
import { useAccountConnectorsGetOne } from '../../../../hooks/api/v2/account/connector/useGetOne';
import { useAccountConnectorsGetOneConfig } from '../../../../hooks/api/v2/account/connector/useGetOneConfig';
import { useContext } from '../../../../hooks/useContext';
import { Connector, ConnectorConfig } from '../../../../interfaces/connector';

import { Button } from '@material-ui/core';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';
import { useEffect } from 'react';
import { useEntityApi } from '../../../../hooks/useEntityApi';

const Configure: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [connectorId, setConnectorId] = useState(id);
  const { userData } = useContext();
  const { data: connectorData, refetch: reloadConnector } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id: connectorId,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { data: config, refetch: reloadConfig } = useAccountConnectorsGetOneConfig<ConnectorConfig>({
    enabled: userData.token,
    id: connectorId,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const [data, setData] = React.useState<any>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [loading, setLoading] = React.useState(false);
  const { updateEntity } = useEntityApi();

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setConnectorId(location.pathname.split('/')[6]);
      setLoading(true);
    });

    return () => unlisten();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const reloadData = async () => {
      if (userData.subscriptionId) {
        await reloadConnector();
        await reloadConfig();
        setLoading(false);
      }
    };
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorId]);

  const handleSubmit = () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      updateEntity(connectorData, data);
    }
  };
  console.log(connectorData);

  return (
    <SC.Flex>
      <SC.FlexDown>
        {config?.data && !loading ? (
          <SC.FormWrapper>
            <JsonForms
              schema={config?.data.schema}
              uischema={config?.data.uischema}
              data={connectorData?.data.data.configuration}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ errors, data }) => {
                errors && setErrors(errors);
                setData(data);
              }}
              validationMode={validationMode}
            />
            <SC.FormInputWrapper>
              <Button
                onClick={handleSubmit}
                style={{ width: '200px' }}
                fullWidth={false}
                size="large"
                color="primary"
                variant="contained"
              >
                Save
              </Button>
            </SC.FormInputWrapper>
          </SC.FormWrapper>
        ) : (
          <CSC.LoaderContainer>
            <CSC.Spinner />
          </CSC.LoaderContainer>
        )}
      </SC.FlexDown>
    </SC.Flex>
  );
};

export default Configure;
