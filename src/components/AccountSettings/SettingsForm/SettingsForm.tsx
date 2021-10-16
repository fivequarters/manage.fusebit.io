import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { ValidationMode } from '@jsonforms/core';
import { useParams } from 'react-router-dom';
import * as CSC from '../../globalStyle';
import { useContext } from '../../../hooks/useContext';
import { useAccountUpdateOne } from '../../../hooks/api/v1/account/account/useUpdateOne';

const schema = {
  type: 'object',
  properties: {
    displayName: {
      type: 'string',
      minLength: 2,
    },
  },
  required: ['displayName'],
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/displayName',
      label: 'Account Name',
      options: {
        hideRequiredAsterisk: true,
      },
    },
  ],
};

const SettingsForm: React.FC = () => {
  const [validationMode, setValidationMode] = useState<ValidationMode>('ValidateAndHide');
  const { userData } = useContext();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<object[]>([]);
  const [formValues, setFormValues] = useState({ displayName: userData.company });
  const { mutateAsync: updateAccount, isLoading } = useAccountUpdateOne();
  const { accountId } = useParams<{ accountId: string }>();

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');

      return;
    }
    await updateAccount({
      accountId,
      ...formValues,
    });

    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);

    setFormValues({
      displayName: userData.company,
    });
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        {editMode ? (
          <>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={formValues}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ errors: _errors, data: _data }) => {
                if (_errors) {
                  setErrors(_errors);
                }
                setFormValues(_data);
              }}
              validationMode={validationMode}
            />
            <Box mt="10px">
              <Button
                disabled={isLoading}
                onClick={handleSubmit}
                style={{ marginRight: '16px' }}
                fullWidth={false}
                size="small"
                color="primary"
                variant="contained"
              >
                {isLoading ? <CircularProgress size={20} /> : 'Save'}
              </Button>
              <Button onClick={handleCancel} fullWidth={false} size="small" color="primary" variant="outlined">
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Box display="flex" flexDirection="column">
            <CSC.InfoFieldWrapper>
              <CSC.InfoFieldPlaceholder>Account Name</CSC.InfoFieldPlaceholder>
              <CSC.InfoField>{userData.company}</CSC.InfoField>
            </CSC.InfoFieldWrapper>
            <Box>
              <Button onClick={handleEdit} fullWidth={false} size="medium" color="primary" variant="outlined">
                Edit information
              </Button>
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default SettingsForm;
