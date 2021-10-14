import React, { useState, useEffect } from 'react';
import { Box, Button } from '@material-ui/core';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { ValidationMode } from '@jsonforms/core';
import jwt_decode from 'jwt-decode';
import { TokenPayload } from '../../../interfaces/tokenPayload';
import { ACCOUNT_SECTION_LINKS } from '../../../utils/constants';
import Drawer from '../../common/Drawer';
import * as CSC from '../../globalStyle';
import { useContext } from '../../../hooks/useContext';

const userPasswordSchema = {
  type: 'object',
  properties: {
    displayName: {
      type: 'string',
      minLength: 2,
    },
  },
  required: ['displayName'],
};

const userPasswordUiSchema = {
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

const socialConnectionSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 2,
    },
    lastName: {
      type: 'string',
      minLength: 2,
    },
  },
  required: ['firstName', 'lastName'],
};

const socialConnectionUiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/firstName',
      options: {
        hideRequiredAsterisk: true,
      },
    },
    {
      type: 'Control',
      scope: '#/properties/lastName',
      options: {
        hideRequiredAsterisk: true,
      },
    },
  ],
};

const Settings: React.FC = () => {
  const [validationMode, setValidationMode] = useState<ValidationMode>('ValidateAndHide');
  const { userData } = useContext();
  const [data, setData] = useState<any>();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<object[]>([]);
  const [socialConnection, setSocialConnection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const socialConnectionInitialData = [
    { label: 'First Name', value: userData.firstName },
    { label: 'Last Name', value: userData.lastName },
  ];

  const UserPasswordInitialData = [{ label: 'Account Name', value: userData.company }];

  useEffect(() => {
    if (userData.token) {
      const decoded: TokenPayload = jwt_decode(userData.token);
      const socialProvider = decoded.sub.split('|', 1)?.[0];
      // checking if it contains - because U/P accounts will be like auth0|... and social connections will be like google-auth2|...
      if (socialProvider.indexOf('-') > 0) {
        // user logged in with a social connection
        setData(socialConnectionInitialData);
        setSocialConnection(true);
      } else {
        setData(UserPasswordInitialData);
        // user logged in with U/P
      }
      setLoading(false);
    }
  }, [userData]);

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
    if (socialConnection) {
      setData(socialConnectionInitialData);
    } else {
      setData(UserPasswordInitialData);
    }
  };

  return (
    <Drawer links={ACCOUNT_SECTION_LINKS}>
      {loading && 'loading...'}
      {editMode && !loading ? (
        <>
          <JsonForms
            schema={socialConnection ? socialConnectionSchema : userPasswordSchema}
            uischema={socialConnection ? socialConnectionUiSchema : userPasswordUiSchema}
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
        !loading && (
          <>
            {data?.map((inputData: any) => (
              <CSC.InfoFieldWrapper key={inputData?.label}>
                <CSC.InfoFieldPlaceholder>{inputData.label}</CSC.InfoFieldPlaceholder>
                <CSC.InfoField>{inputData?.value}</CSC.InfoField>
              </CSC.InfoFieldWrapper>
            ))}
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
        )
      )}
    </Drawer>
  );
};

export default Settings;
