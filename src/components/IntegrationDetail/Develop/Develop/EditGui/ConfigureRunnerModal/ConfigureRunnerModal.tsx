import React, { useEffect, useState } from 'react';
import { Button, Modal, Backdrop, Box } from '@material-ui/core';
import * as SC from './styles';
import * as CSC from '../../../../../globalStyle';
import { getIntegrationConfig } from '../../../../../../utils/localStorage';
import { useParams } from 'react-router-dom';

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
  const [verbSelectorActive, setVerbSelectorActive] = useState(false);
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
    let errors = {} as Errors;
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
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <SC.Card open={open}>
        <CSC.Close onClick={() => setOpen(false)} />
        <CSC.ModalTitle margin="0 0 16px 0">Configure runner</CSC.ModalTitle>
        <Box display="flex" mt="30px">
          <CSC.Flex width="max-content" margin="0 48px 0 0" flexDown>
            <SC.Subtitle>Verb</SC.Subtitle>
            <SC.VerbSelector
              onBlur={() => validateForm()}
              onClick={() => setVerbSelectorActive(!verbSelectorActive)}
              hasError={!!formErrors.method}
            >
              {formValues?.method} <SC.VerbArrow active={verbSelectorActive} />
              <SC.VerbOptionsWrapper active={verbSelectorActive}>
                {Verbs.map((verb) => (
                  <SC.VerbOption
                    onClick={() => {
                      const newValues = { ...formValues, method: verb as 'post' | 'delete' | 'put' | 'get' | 'patch' };
                      validateForm(newValues);
                      setFormValues(newValues);
                    }}
                    key={verb}
                    selected={verb === formValues?.method}
                  >
                    {verb}
                  </SC.VerbOption>
                ))}
              </SC.VerbOptionsWrapper>
            </SC.VerbSelector>
            {formErrors.method && <SC.ErrorMessage>{formErrors.method}</SC.ErrorMessage>}
          </CSC.Flex>
          <CSC.Flex flexDown>
            <SC.Subtitle>URL</SC.Subtitle>
            <div>
              <SC.Textarea
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
        <Box display="flex" mt="15px" flexDirection="column">
          <SC.Subtitle>Payload</SC.Subtitle>
          <div>
            <SC.Textarea
              hasError={!!formErrors.payload}
              onChange={(e) => {
                const newValues = { ...formValues, payload: e.target.value };
                validateForm(newValues);
                setFormValues(newValues);
              }}
              value={formValues?.payload}
              onBlur={() => validateForm()}
              height="250px"
            />
            {formErrors.payload && <SC.ErrorMessage>{formErrors.payload}</SC.ErrorMessage>}
          </div>
        </Box>
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
