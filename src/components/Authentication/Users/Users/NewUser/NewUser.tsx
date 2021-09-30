import React from 'react';
import { Props } from '../../../../../interfaces/newUser';
import * as SC from './styles';
import { Button } from '@material-ui/core';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { NewUserData } from '../../../../../interfaces/newUserData';
import CopyLine from '../../../../CopyLine';
import * as CSC from '../../../../globalStyle';
import { startCase } from '../../../../../utils/utils';

const schema = {
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
    primaryEmail: {
      type: 'string',
      format: 'email',
      pattern: '^\\S+@\\S+\\.\\S+$',
      minLength: 6,
      maxLength: 127,
    },
  },
  required: ['firstName', 'lastName', 'primaryEmail'],
};

const uischema = {
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
    {
      type: 'Control',
      scope: '#/properties/primaryEmail',
      options: {
        hideRequiredAsterisk: true,
      },
    },
  ],
};

const NewUser = React.forwardRef(({ open, onClose, createUser }: Props, ref) => {
  const [data, setData] = React.useState<NewUserData>({
    firstName: undefined,
    lastName: undefined,
    primaryEmail: undefined,
  });
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [userCreated, setUserCreated] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [token, setToken] = React.useState('');

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      setIsSubmitting(true);
      const dataToSubmit = {
        firstName: startCase(data.firstName || ''),
        lastName: startCase(data.lastName || ''),
        primaryEmail: data.primaryEmail?.toLowerCase(),
      };
      const token = await createUser(dataToSubmit);
      if (token !== null) {
        setUserCreated(true);
        setIsSubmitting(false);
        setToken(token);
        setData(dataToSubmit);
      }
    }
  };

  return (
    <SC.Card open={open}>
      <CSC.Close onClick={() => onClose()} />
      {!userCreated ? (
        <>
          <CSC.ModalTitle>New User</CSC.ModalTitle>
          <SC.FormWrapper>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={data}
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
                disabled={isSubmitting}
                onClick={handleSubmit}
                style={{ width: '200px' }}
                fullWidth={false}
                size="large"
                color="primary"
                variant="contained"
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </SC.FormInputWrapper>
          </SC.FormWrapper>
        </>
      ) : (
        <>
          <CSC.ModalTitle margin="0 0 100px 0">
            User {startCase(data.firstName || '')} {startCase(data.lastName || '')} Created!
          </CSC.ModalTitle>
          <CSC.ModalDescription>
            Securely share the following link with the user. The one-time use token included in the link expires in
            eight hours.
          </CSC.ModalDescription>
          <CopyLine text={token} />
          <SC.UserCreatedButtonWrapper>
            <Button
              onClick={() => onClose()}
              style={{ width: '200px' }}
              fullWidth={false}
              size="large"
              color="primary"
              variant="contained"
            >
              Done
            </Button>
          </SC.UserCreatedButtonWrapper>
        </>
      )}
    </SC.Card>
  );
});

export default NewUser;
