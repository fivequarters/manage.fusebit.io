import React, { useEffect, useState } from 'react';
import { Button, Box, MenuItem, Select } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { getIntegrationConfig } from '@utils/localStorage';
import { useAuthContext } from '@hooks/useAuthContext';
import Label from '@components/common/FormFields/Label';
import styled from 'styled-components';
import Textarea from '@components/common/FormFields/Textarea';
import TextField from '@components/common/FormFields/TextField';
import Modal from '@components/common/Modal';

const StyledCard = styled.div`
  padding: 0 32px;
  width: 795px;
  border-radius: 8px;

  @media only screen and (max-width: 550px) {
    width: 100%;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
  }
`;

const StyledButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

const StyledErrorMessage = styled.p`
  line-height: 20px;
  margin: 5px 0 0 0;
  color: var(--primary-color);
`;

const StyledPayloadTextarea = styled(Textarea)`
  height: 250px !important;
`;

const StyledVerbSelect = styled(Select)`
  width: 110px;
  margin-top: 19px;
  font-size: 14px;
`;

const StyledVerbItem = styled(MenuItem)`
  font-size: 14px;
`;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface Errors {
  method: string;
  url: string;
  payload: string;
}

// TODO: Use material UI to creat form inputs

const Verbs = ['get', 'post', 'put', 'patch', 'delete'];

const ConfigureRunnerModal: React.FC<Props> = ({ open, setOpen }) => {
  const { id } = useParams<{ id: string }>();
  const { getTenantId } = useAuthContext();
  const tenantId = getTenantId();
  const integrationConfig = getIntegrationConfig(id, tenantId);
  const [formValues, setFormValues] = useState(integrationConfig.runner);
  const [formErrors, setFormErrors] = useState<Partial<Errors>>({});

  useEffect(() => {
    return () => {
      setFormValues(getIntegrationConfig(id, tenantId).runner);
      setFormErrors({});
    };
  }, [open, id, tenantId]);

  const validateForm = (newValues?: any) => {
    const { method, url, payload } = newValues || formValues || {};
    const errors = {} as Errors;
    let valid = true;

    if (!method) {
      errors.method = 'Method is required';
      valid = false;
    }

    if (!url) {
      errors.url = 'Url is required';
      valid = false;
    }

    if (payload) {
      try {
        JSON.parse(payload);
      } catch (error) {
        errors.payload = 'Payload must be valid JSON';
        valid = false;
      }
    }

    setFormErrors(errors);

    return valid;
  };

  const handleSave = () => {
    const isValid = validateForm();

    if (isValid) {
      localStorage.setItem(id, JSON.stringify({ ...integrationConfig, runner: formValues }));
      setOpen(false);
    }
  };

  return (
    <Modal title="Configure runner" disableActions open={open} onClose={() => setOpen(false)}>
      <StyledCard tabIndex={-1}>
        <Box display="flex">
          <Box display="flex" flexDirection="column" width="max-content" margin="0 48px 0 0">
            <Label>Verb</Label>
            <StyledVerbSelect
              value={formValues?.method}
              onChange={(e: any) => {
                const newValues = {
                  ...formValues,
                  method: e.target.value as 'post' | 'delete' | 'put' | 'get' | 'patch',
                };
                validateForm(newValues);
                setFormValues(newValues);
              }}
            >
              {Verbs.map((verb) => (
                <StyledVerbItem key={verb} value={verb}>
                  {verb.toLocaleUpperCase()}
                </StyledVerbItem>
              ))}
            </StyledVerbSelect>
          </Box>
          <Box display="flex" flexDirection="column" width="100%">
            <Label>URL</Label>
            <div>
              <TextField
                fieldVariant="customBlue"
                hasError={!!formErrors.url}
                onChange={(e) => {
                  const newValues = { ...formValues, url: e.target.value };
                  validateForm(newValues);
                  setFormValues(newValues);
                }}
                onBlur={() => validateForm()}
                value={formValues?.url}
              />
              {formErrors.url && <StyledErrorMessage>{formErrors.url}</StyledErrorMessage>}
            </div>
          </Box>
        </Box>
        {formValues?.method !== 'get' && (
          <Box display="flex" mt="15px" flexDirection="column">
            <Label>Payload</Label>
            <div>
              <StyledPayloadTextarea
                fieldVariant="customBlue"
                hasError={!!formErrors.payload}
                onChange={(e: any) => {
                  const newValues = { ...formValues, payload: e.target.value };
                  validateForm(newValues);
                  setFormValues(newValues);
                }}
                value={formValues?.payload}
                onBlur={() => validateForm()}
              />
              {formErrors.payload && <StyledErrorMessage>{formErrors.payload}</StyledErrorMessage>}
            </div>
          </Box>
        )}
        <StyledButtonsWrapper>
          <Button
            onClick={handleSave}
            style={{ width: '200px', marginLeft: 'auto' }}
            size="large"
            variant="contained"
            color="primary"
            disabled={Object.keys(formErrors).length > 0}
          >
            Save
          </Button>
        </StyledButtonsWrapper>
      </StyledCard>
    </Modal>
  );
};

export default ConfigureRunnerModal;
