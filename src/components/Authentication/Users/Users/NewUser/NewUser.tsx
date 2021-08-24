import React from 'react';
import { Props } from '../../../../../interfaces/newUser';
import * as SC from './styles';
import { Button } from '@material-ui/core';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import cross from '../../../../../assets/cross.svg';
import { NewUserData } from '../../../../../interfaces/newUserData';
import { useCapitalize } from '../../../../../hooks/useCapitalize';
import CopyLine from '../../../../CopyLine';

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
  const { capitalize } = useCapitalize();

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      setIsSubmitting(true);
      const dataToSubmit = {
        firstName: capitalize(data.firstName || ''),
        lastName: capitalize(data.lastName || ''),
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
      <SC.Close onClick={() => onClose()} src={cross} alt="close" height="12" width="12" />
      {!userCreated ? (
        <>
          <SC.Title>New User</SC.Title>
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
          <SC.Title>
            User {capitalize(data.firstName || '')} {capitalize(data.lastName || '')} Created!
          </SC.Title>
          <SC.Description>
            Securely share the following link with the user. The one-time use token included in the link expires in
            eight hours.
          </SC.Description>
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
