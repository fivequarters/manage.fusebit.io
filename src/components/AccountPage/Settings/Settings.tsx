import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { ValidationMode } from '@jsonforms/core';
import { ACCOUNT_SECTION_LINKS } from '../../../utils/constants';
import Drawer from '../../common/Drawer';
import * as CSC from '../../globalStyle';

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

const Settings: React.FC = () => {
  const [validationMode, setValidationMode] = useState<ValidationMode>('ValidateAndHide');
  const [data, setData] = useState({ displayName: 'Saraza' });
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<object[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      // update the user info
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setIsSubmitting(false);
    setData({ displayName: 'Saraza' });
  };

  return (
    <Drawer links={ACCOUNT_SECTION_LINKS}>
      {editMode ? (
        <>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ errors: _errors, data: _data }) => {
              if (_errors) {
                setErrors(_errors);
              }
              setData(_data);
            }}
            validationMode={validationMode}
          />
          <Box mt="10px">
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              style={{ marginRight: '16px' }}
              fullWidth={false}
              size="small"
              color="primary"
              variant="contained"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleCancel} fullWidth={false} size="small" color="primary" variant="outlined">
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <>
          <CSC.InfoFieldWrapper>
            <CSC.InfoFieldPlaceholder>Account Name</CSC.InfoFieldPlaceholder>
            <CSC.InfoField>{data.displayName}</CSC.InfoField>
          </CSC.InfoFieldWrapper>

          <Box mt="40px">
            <Button
              onClick={() => setEditMode(true)}
              fullWidth={false}
              size="medium"
              color="primary"
              variant="outlined"
            >
              Edit information
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default Settings;
