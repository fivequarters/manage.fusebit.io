import React from 'react';
import { useParams } from 'react-router-dom';
import * as SC from './styles';
import { useAccountConnectorsGetOne } from '../../../hooks/api/v2/account/connector/useGetOne';
import { useAccountConnectorsGetOneConfig } from '../../../hooks/api/v2/account/connector/useGetOneConfig';
import { useContext } from '../../../hooks/useContext';
import { Connector, ConnectorConfig } from '../../../interfaces/connector';

import { Button } from '@material-ui/core';
import arrow from '../../../assets/arrow-primary.svg';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';

const Configure: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: connectorData } = useAccountConnectorsGetOne<Connector>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { data: config } = useAccountConnectorsGetOneConfig<ConnectorConfig>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const [data, setData] = React.useState();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');

  const updateConnector = () => {};

  const handleSubmit = () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      updateConnector();
    }
  };

  return (
    <SC.Flex>
      <SC.FlexDown>
        <SC.InfoWrapper>
          <SC.InfoTitle>ID:</SC.InfoTitle>
          <SC.InfoDescription>{connectorData?.data.id}</SC.InfoDescription>
        </SC.InfoWrapper>
        <SC.InfoWrapper>
          <SC.InfoTitle>Slack app:</SC.InfoTitle>
          <SC.InfoLink href={'/'}>
            Acme Chatbot
            <img src={arrow} alt="arrow" height="16" width="16" />
          </SC.InfoLink>
        </SC.InfoWrapper>
      </SC.FlexDown>
      <SC.FlexDown>
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
      </SC.FlexDown>
    </SC.Flex>
  );
};

export default Configure;
