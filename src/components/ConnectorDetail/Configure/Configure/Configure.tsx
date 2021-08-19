import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as SC from './styles';
import { useAccountConnectorsGetOne } from '../../../../hooks/api/v2/account/connector/useGetOne';
import { useAccountConnectorsGetOneConfig } from '../../../../hooks/api/v2/account/connector/useGetOneConfig';
import { useContext } from '../../../../hooks/useContext';
import { Connector, ConnectorConfig } from '../../../../interfaces/connector';

import { Button } from '@material-ui/core';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';
import { useAccountConnectorUpdateConnector } from '../../../../hooks/api/v2/account/connector/useUpdateOne';
import { Operation } from '../../../../interfaces/operation';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { useEffect } from 'react';

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
  const updateConnector = useAccountConnectorUpdateConnector<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setConnectorId(location.pathname.split('/')[6]);
    });

    return () => unlisten();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData.subscriptionId) {
      reloadConnector();
      reloadConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorId]);

  const _updateConnector = async () => {
    try {
      createLoader();
      const newConnectorData = connectorData;
      if (newConnectorData) {
        newConnectorData.data.data.configuration = data;
        const response = await updateConnector.mutateAsync({
          subscriptionId: userData.subscriptionId,
          accountId: userData.accountId,
          id: newConnectorData?.data.id,
          data: newConnectorData.data,
        });
        await waitForOperations([response.data.operationId]);
      }
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  const handleSubmit = () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      _updateConnector();
    }
  };

  return (
    <SC.Flex>
      <SC.FlexDown>
        {config?.data && (
          <SC.FormWrapper>
            <JsonForms
              schema={config?.data.schema}
              uischema={config?.data.uischema}
              data={config?.data.data}
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
        )}
      </SC.FlexDown>
    </SC.Flex>
  );
};

export default Configure;
