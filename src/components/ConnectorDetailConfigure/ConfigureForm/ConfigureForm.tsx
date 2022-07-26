import React from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Box, Button, Container, useMediaQuery } from '@material-ui/core';
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
import { data as dummyData } from './dummyData/data';
import { schema as dummySchema } from './dummyData/schema';
import { uischema as dummyUiSchema } from './dummyData/uischema';

const TitleStyles = css`
  font-size: 20px;
  line-height: 26px;
  color: var(--black);
  font-weight: 600;
`;

const StyledFormWrapper = styled.form<{ useProduction?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;

  @media only screen and (max-width: 880px) {
    margin-left: 0;
  }

  .MuiFormControlLabel-root {
    padding: 32px 0;
    display: flex;
    flex-direction: row-reverse;
    width: fit-content;
    margin-left: 0;

    .MuiTypography-root {
      ${TitleStyles}
    }

    &[id*='useProduction'] {
      padding: 0;
      margin-bottom: 48px;
      margin-left: ${(props) => props.useProduction && '-320px'};

      .MuiTypography-root {
        font-size: 16px;
        line-height: 22px;
        color: var(--black);
        font-weight: 400;
      }
    }
  }

  .MuiCard-root {
    padding: 0;
    box-shadow: none;
    margin: 0;
    border-bottom: 1px solid rgba(149, 149, 149, 0.3);
    border-radius: 0;

    &:not(:first-child) {
      padding-top: 48px;
    }
  }

  .MuiCardHeader-root {
    padding: 0;
    padding-bottom: 32px;

    &:first-child {
      padding-top: 32px;
    }

    .MuiCardHeader-title {
      ${TitleStyles}
    }
  }

  .MuiCardContent-root {
    padding: 0;
  }

  .MuiFormControl-root {
    margin-bottom: 48px;
  }

  .MuiGrid-spacing-xs-2 > .MuiGrid-item {
    &:nth-child(odd) {
      padding-right: 48px;
    }

    padding-bottom: 0;
  }
`;

const StyledButtonsWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 24px 0;
  height: max-content;
  background: linear-gradient(360deg, #ffffff 32%, rgba(255, 255, 255, 0) 100%);
`;

const StyledContainer = styled(Container)`
  display: flex;
  padding: 0 32px 0 16px;
`;

const StyledFadingWrapper = styled(Box)``;

const StyledSidebarOption = styled.button<{ selected?: boolean }>`
  font-family: 'Poppins';
  padding: 12px 16px;
  font-size: 14px;
  line-height: 20px;
  font-weight: ${(props) => (props.selected ? 700 : 400)};
  border-radius: 4px;
  color: var(--black);
  margin-bottom: 16px;
  width: 100%;
  outline: rgba(255, 255, 255, 0);
  border: none;
  background: ${(props) => (props.selected ? 'var(--secondary-color)' : 'none')};
  text-align: left;
  transition: all 0.25s linear;

  &:hover {
    background: var(--secondary-color);
  }
`;

const ConfigureForm: React.FC = () => {
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
  const isMobile = useMediaQuery('max-width: 880px');
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      trackEventMemoized('Configure Save Button Clicked', 'Connector');
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
    <Box
      display="flex"
      flexDirection={isMobile && 'column'}
      alignItems={isMobile && 'center'}
      mb="100px"
      minHeight="calc(100vh - 350px)"
    >
      <Box display="flex" flexDirection="column" position="relative" width="100%">
        {config?.data && !isConnectorDataLoading && !isConnectorConfigLoading ? (
          <StyledFormWrapper useProduction={data?.mode?.useProduction}>
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
            <Box display="flex" alignItems="center" position="relative">
              {data && data?.mode?.useProduction && (
                <Box
                  display="flex"
                  flexDirection="column"
                  padding="24px"
                  marginTop="auto"
                  marginRight="48px"
                  height="calc(100% - 86px)"
                  minWidth="272px"
                  maxWidth="272px"
                  borderRadius="16px"
                  style={{ boxShadow: '0px 20px 48px rgba(52, 72, 123, 0.1)' }}
                >
                  <StyledSidebarOption selected>Fusebit Connector Configuration</StyledSidebarOption>
                  <StyledSidebarOption>Service Configuration</StyledSidebarOption>
                  <StyledSidebarOption>Advanced Fusebit Options</StyledSidebarOption>
                </Box>
              )}
              <BaseJsonForm
                schema={dummySchema}
                uischema={dummyUiSchema}
                data={dummyData}
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
            </Box>
            {data && data?.mode?.useProduction && (
              <StyledButtonsWrapper>
                <StyledContainer maxWidth="lg">
                  <StyledFadingWrapper display="flex" alignItems="center" width="100%">
                    <Button
                      onClick={handleSubmit}
                      style={{ width: '200px', marginLeft: 'auto' }}
                      fullWidth={false}
                      size="large"
                      color="primary"
                      variant="contained"
                    >
                      Save
                    </Button>
                  </StyledFadingWrapper>
                </StyledContainer>
              </StyledButtonsWrapper>
            )}
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
