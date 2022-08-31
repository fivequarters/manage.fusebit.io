import React, { useEffect, useState } from 'react';
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
import { trackEventMemoized } from '@utils/analytics';
import InformationalBanner from '@components/common/InformationalBanner';
import BaseJsonForm from '@components/common/BaseJsonForm';
import * as CSC from '@components/globalStyle';
import { useQueryClient } from 'react-query';
import { FROM_INTEGRATIONS_PAGE, FROM_INTEGRATION_DETAIL_PAGE } from '@utils/constants';

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
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 49px;

  @media only screen and (max-width: 880px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const StyledBackButton = styled(Button)`
  margin-right: 16px;

  @media only screen and (max-width: 880px) {
    margin-right: 0;
    margin-bottom: 16px;
  }
`;

const ConfigureForm: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { isLoading: isConnectorDataLoading, data: connectorData } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { isLoading: isConnectorConfigLoading, data: config } = useAccountConnectorsGetOneConfig<ConnectorConfig>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const [data, setData] = React.useState<any>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const { updateEntity } = useEntityApi();
  const { feed } = useGetFeedById({
    id: connectorData?.data.tags['fusebit.feedId'],
    type: connectorData?.data.tags['fusebit.feedType'],
  });
  const [backButtonState, setBackButtonState] = useState<{ enabled: boolean; url: string }>({
    enabled: false,
    url: '',
  });
  const isMobile = useMediaQuery('max-width: 880px');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (history.location.state) {
      const { from, url } = history.location.state as { from: string; url: string };
      if (from === FROM_INTEGRATION_DETAIL_PAGE || from === FROM_INTEGRATIONS_PAGE) {
        setBackButtonState({ enabled: true, url });
      }
    }
  }, [history]);

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      trackEventMemoized('Configure Save Button Clicked', 'Connector', { connector: id });
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
        {config?.data &&
        config?.data.schema &&
        config?.data.uischema &&
        !isConnectorDataLoading &&
        !isConnectorConfigLoading ? (
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
                    trackEventMemoized('Docs In This Guide Link Clicked', 'Connector', {
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
              data={config.data.data}
              schema={config.data.schema}
              uischema={config.data.uischema}
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
                  trackEventMemoized('Enable Production Credentials Clicked', 'Connector', {
                    Connector: connectorData?.data.tags['fusebit.feedId'],
                    State: 'On',
                  });
                } else if (
                  data &&
                  data.mode?.useProduction !== newData.mode?.useProduction &&
                  newData.mode?.useProduction === false
                ) {
                  trackEventMemoized('Enable Production Credentials Clicked', 'Connector', {
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

                setData(newData);
              }}
              validationMode={validationMode}
            />
            <StyledFormInputWrapper>
              {backButtonState.enabled && (
                <StyledBackButton
                  onClick={() => history.push(backButtonState.url)}
                  style={{
                    width: '200px',
                  }}
                  fullWidth={false}
                  size="large"
                  color="primary"
                  variant="outlined"
                >
                  Back
                </StyledBackButton>
              )}
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
