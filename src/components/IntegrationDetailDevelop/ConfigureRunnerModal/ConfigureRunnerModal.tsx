import React, { useEffect, useState } from 'react';
import { Button, Box } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { getIntegrationConfig } from '@utils/localStorage';
import Label from '@components/common/FormFields/Label';
import TextField from '@components/common/FormFields/TextField';
import Modal from '@components/common/Modal';
import * as CSC from '@components/globalStyle';
import * as SC from './styles';

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
  const [formValues, setFormValues] = useState(getIntegrationConfig(id).runner);
  const [formErrors, setFormErrors] = useState<Partial<Errors>>({});

  useEffect(() => {
    return () => {
      setFormValues(getIntegrationConfig(id).runner);
      setFormErrors({});
    };
  }, [open, id]);

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
      localStorage.setItem(id, JSON.stringify({ ...getIntegrationConfig(id), runner: formValues }));
      setOpen(false);
    }
  };

  return (
    <Modal title="Configure runner" disableActions open={open} onClose={() => setOpen(false)}>
      <SC.Card open={open} tabIndex={-1}>
        <Box display="flex">
          <CSC.Flex width="max-content" margin="0 48px 0 0" flexDown>
            <Label>Verb</Label>
            <SC.VerbSelect
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
                <SC.VerbItem key={verb} value={verb}>
                  {verb.toLocaleUpperCase()}
                </SC.VerbItem>
              ))}
            </SC.VerbSelect>
          </CSC.Flex>
          <CSC.Flex flexDown>
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
              {formErrors.url && <SC.ErrorMessage>{formErrors.url}</SC.ErrorMessage>}
            </div>
          </CSC.Flex>
        </Box>
        {formValues?.method !== 'get' && (
          <Box display="flex" mt="15px" flexDirection="column">
            <Label>Payload</Label>
            <div>
              <SC.PayloadTextarea
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
              {formErrors.payload && <SC.ErrorMessage>{formErrors.payload}</SC.ErrorMessage>}
            </div>
          </Box>
        )}
        <SC.ButtonsWrapper>
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
        </SC.ButtonsWrapper>
      </SC.Card>
    </Modal>
  );
};

export default ConfigureRunnerModal;
