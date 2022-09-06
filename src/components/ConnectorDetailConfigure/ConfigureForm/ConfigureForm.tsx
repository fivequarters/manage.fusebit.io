import React, { useCallback, useEffect } from 'react';
import { useParams, Prompt } from 'react-router-dom';
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
import { useError } from '@hooks/useError';
import { useSuccess } from '@hooks/useSuccess';
import { useQueryClient } from 'react-query';
import SidebarOptions from './SidebarOptions';

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

      @media only screen and (max-width: 880px) {
        margin-left: 0;
        margin-bottom: 16px;
      }

      .MuiTypography-root {
        font-size: 16px;
        line-height: 22px;
        color: var(--black);
        font-weight: 400;
      }
    }
  }

  .MuiBox-root {
    width: 100%;
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

      @media only screen and (max-width: 880px) {
        padding-right: 8px;
      }
    }

    padding-bottom: 0;
  }
`;

const StyledButtonsWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding-bottom: 24px;
  height: max-content;
  background: linear-gradient(360deg, #ffffff 20%, rgba(255, 255, 255, 0) 100%);

  @media only screen and (max-width: 880px) {
    background: linear-gradient(360deg, #ffffff 40%, rgba(255, 255, 255, 0) 100%);
  }
`;

const StyledContainer = styled(Container)`
  display: flex;
  padding: 0 32px 0 16px;
  align-items: center;
  width: 100%;

  @media only screen and (max-width: 880px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledSaveButton = styled(Button)`
  width: 200px;
  margin-left: auto;

  @media only screen and (max-width: 880px) {
    margin-left: 0;
    width: 100%;
    max-width: 200px;
  }
`;

const ConfigureForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();
  const { createError } = useError();
  const { createSuccess } = useSuccess();
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
  const [isDirty, setIsDirty] = React.useState(false);
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const { updateEntity } = useEntityApi();
  const { feed } = useGetFeedById({
    id: connectorData?.data.tags['fusebit.feedId'],
    type: connectorData?.data.tags['fusebit.feedType'],
  });
  const isMobile = useMediaQuery('(max-width: 880px)');
  const queryClient = useQueryClient();

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set

        e.returnValue = '';
      }
    },
    [isDirty]
  );

  useEffect(() => {
    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, handleBeforeUnload]);

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      trackEventMemoized('Configure Save Button Clicked', 'Connector', { connector: id });
      try {
        await updateEntity(connectorData, data);
        queryClient.invalidateQueries([
          ACCOUNT_CONNECTORS_GET_ONE_CONFIG,
          { accountId: userData.accountId, id, subscriptionId: userData.subscriptionId },
        ]);
        createSuccess('Connector Configuration Saved Successfully');
        setIsDirty(false);
      } catch (e) {
        createError(e);
        setIsDirty(false);
      }
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
      <Prompt when={isDirty} message="There are unsaved changes, are you sure you want to leave?" />
      <Box display="flex" flexDirection="column" position="relative" width="100%">
        {config?.data &&
        config?.data.schema &&
        config?.data.uischema &&
        !isConnectorDataLoading &&
        !isConnectorConfigLoading ? (
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
            <Box id="form-wrapper" display="flex" alignItems="center" position="relative">
              {!isMobile && data && data?.mode?.useProduction && <SidebarOptions config={config.data} />}
              <BaseJsonForm
                schema={config?.data.schema}
                uischema={config?.data.uischema}
                data={config?.data.data}
                onChange={({ errors: _errors, data: newData }) => {
                  setIsDirty(JSON.stringify(newData) !== JSON.stringify(config?.data.data));

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
                  <StyledSaveButton
                    onClick={handleSubmit}
                    fullWidth={false}
                    size="large"
                    color="primary"
                    variant="contained"
                  >
                    Save
                  </StyledSaveButton>
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
