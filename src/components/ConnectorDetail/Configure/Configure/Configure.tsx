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
import { useGetFeedById } from '../../../../hooks/useGetFeedById';

import LabelBanner from '../../../LabelBanner';
import { trackEvent } from '../../../../utils/analytics';

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
  const [jsonFormsInputs, setJsonFormsInputs] = React.useState<any>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [loading, setLoading] = React.useState(false);
  const { updateEntity } = useEntityApi();
  const { feed } = useGetFeedById({
    id: connectorData?.data.tags['fusebit.feedId'],
    type: connectorData?.data.tags['fusebit.feedType'],
  });

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
      trackEvent('Configure Save Button Clicked', 'Connector');
      updateEntity(connectorData, data);
    }
  };

  const configureAppDocUrl: string | undefined = feed?.resources?.configureAppDocUrl;

  // Adjust for older or manually created connectors that don't have mode set.
  if (config?.data.data && (!config.data.data.mode || !('useProduction' in config.data.data.mode))) {
    config.data.data.mode = { ...(config.data.data.mode || {}), useProduction: true };
  }

  return (
    <SC.Flex>
      <SC.FlexDown>
        {config?.data && !loading ? (
          <SC.FormWrapper>
            {configureAppDocUrl ? (
              <LabelBanner>
                By default, Connectors use Fusebit demonstration credentials, which are intended for testing only. When
                you are ready for production use, supply your own credentials below, as described in{' '}
                <a href={configureAppDocUrl}>this guide</a>.
              </LabelBanner>
            ) : (
              <LabelBanner>
                By default, Connectors use Fusebit demonstration credentials, which are intended for testing only.
              </LabelBanner>
            )}
            <JsonForms
              schema={config?.data.schema}
              uischema={config?.data.uischema}
              data={jsonFormsInputs || config?.data.data}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ errors, data: newData }) => {
                // Clear the clientId and clientSecret when going from non-prod to production.
                if (
                  newData.mode?.useProduction !== config?.data.data?.mode?.useProduction &&
                  newData.mode?.useProduction !== data?.mode?.useProduction &&
                  newData.mode?.useProduction
                ) {
                  newData.clientId = '';
                  newData.clientSecret = '';
                }

                if (
                  !newData.mode?.useProduction &&
                  !(newData.clientId?.length > 0 && newData.clientSecret?.length > 0)
                ) {
                  const random = () => {
                    const randBuffer = [...window.crypto.getRandomValues(new Uint8Array(32))];
                    return randBuffer.map((x) => x.toString(16).padStart(2, '0')).join('');
                  };
                  newData.clientId = random();
                  newData.clientSecret = random();
                  newData.mode = { ...(newData.mode || {}), useProduction: false };
                }

                errors && setErrors(errors);
                setJsonFormsInputs(newData);
                setData(newData);
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
