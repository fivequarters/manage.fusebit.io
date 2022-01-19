import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Box, Button, useMediaQuery } from '@material-ui/core';

import { ValidationMode } from '@jsonforms/core';
import { useAccountConnectorsGetOne } from '@hooks/api/v2/account/connector/useGetOne';
import {
  ACCOUNT_CONNECTORS_GET_ONE_CONFIG,
  useAccountConnectorsGetOneConfig,
} from '@hooks/api/v2/account/connector/useGetOneConfig';
import { useAuthContext } from '@hooks/useAuthContext';
import { Connector, ConnectorConfig } from '@interfaces/connector';
import { useEntityApi } from '@hooks/useEntityApi';
import { useGetFeedById } from '@hooks/useGetFeedById';
import { trackEvent } from '@utils/analytics';
import InformationalBanner from '@components/common/InformationalBanner';
import BaseJsonForm from '@components/common/BaseJsonForm';
import * as CSC from '@components/globalStyle';
import { useQueryClient } from 'react-query';

const StyledFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;

  @media only screen and (max-width: 880px) {
    margin-left: 0;
  }
`;

const StyledFormInputWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 49px;

  @media only screen and (max-width: 880px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const ConfigureForm: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [connectorId, setConnectorId] = useState(id);
  const { userData } = useAuthContext();
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
  const isMobile = useMediaQuery('max-width: 880px');
  const queryClient = useQueryClient();

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setLoading(true);
      setConnectorId(location.pathname.split('/')[6]);
      setJsonFormsInputs(undefined);
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

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorId]);

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      trackEvent('Configure Save Button Clicked', 'Connector');
      await updateEntity(connectorData, data);
      queryClient.invalidateQueries([
        ACCOUNT_CONNECTORS_GET_ONE_CONFIG,
        { accountId: userData.accountId, id, subscriptionId: userData.subscriptionId },
      ]);
    }
  };

  const configureAppDocUrl: string | undefined = feed?.resources?.configureAppDocUrl;

  // Adjust for older or manually created connectors that don't have mode set.
  if (config?.data.data && (!config.data.data.mode || !('useProduction' in config.data.data.mode))) {
    config.data.data.mode = { ...(config.data.data.mode || {}), useProduction: true };
  }

  return (
    <Box display="flex" flexDirection={isMobile && 'column'} alignItems={isMobile && 'center'} mb="100px">
      <Box display="flex" flexDirection="column" position="relative" width="100%">
        {config?.data && !loading ? (
          <StyledFormWrapper>
            {configureAppDocUrl ? (
              <InformationalBanner>
                By default, Connectors use Fusebit demonstration credentials, which are intended for testing only. When
                you are ready for production use, supply your own credentials below, as described in{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={configureAppDocUrl}
                  onClick={() => {
                    trackEvent('Docs In This Guide Link Clicked', 'Connector', {
                      Connector: connectorData?.data.tags['fusebit.feedId'],
                    });
                  }}
                >
                  this guide
                </a>
                .
              </InformationalBanner>
            ) : (
              <InformationalBanner>
                By default, Connectors use Fusebit demonstration credentials, which are intended for testing only.
              </InformationalBanner>
            )}
            <BaseJsonForm
              schema={config?.data.schema}
              uischema={config?.data.uischema}
              data={jsonFormsInputs || config?.data.data}
              onChange={({ errors: _errors, data: newData }) => {
                // Clear the clientId and clientSecret when going from non-prod to production.
                if (
                  newData.mode?.useProduction !== config?.data.data?.mode?.useProduction &&
                  newData.mode?.useProduction !== data?.mode?.useProduction &&
                  newData.mode?.useProduction
                ) {
                  newData.clientId = '';
                  newData.clientSecret = '';
                }

                if (data && data.mode?.useProduction !== newData.mode?.useProduction && newData.mode?.useProduction) {
                  trackEvent('Enable Production Credentials Clicked', 'Connector', {
                    Connector: connectorData?.data.tags['fusebit.feedId'],
                    State: 'On',
                  });
                } else if (
                  data &&
                  data.mode?.useProduction !== newData.mode?.useProduction &&
                  newData.mode?.useProduction === false
                ) {
                  trackEvent('Enable Production Credentials Clicked', 'Connector', {
                    Connector: connectorData?.data.tags['fusebit.feedId'],
                    State: 'Off',
                  });
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

                if (_errors) {
                  setErrors(_errors);
                }

                setJsonFormsInputs(newData);
                setData(newData);
              }}
              validationMode={validationMode}
            />
            <StyledFormInputWrapper>
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
            </StyledFormInputWrapper>
          </StyledFormWrapper>
        ) : (
          <CSC.LoaderContainer>
            <CSC.Spinner />
          </CSC.LoaderContainer>
        )}
      </Box>
    </Box>
  );
};

export default ConfigureForm;
