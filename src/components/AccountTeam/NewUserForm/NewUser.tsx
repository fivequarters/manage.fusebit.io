import React from 'react';
import { Button } from '@material-ui/core';
import { ValidationMode } from '@jsonforms/core';
import { Props } from '@interfaces/newUser';
import { NewUserData } from '@interfaces/newUserData';
import { startCase } from '@utils/utils';
import CopyLine from '@components/common/CopyLine';
import BaseJsonForm from '@components/common/BaseJsonForm';
import * as SC from './styles';
import * as CSC from '../../globalStyle';

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

const CreateUserForm = React.forwardRef<HTMLDivElement, Props>(({ open, onClose, createUser }, ref) => {
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
      const _token = await createUser(dataToSubmit);
      if (_token !== null) {
        setUserCreated(true);
        setIsSubmitting(false);
        setToken(_token);
        setData(dataToSubmit);
      }
    }
  };

  return (
    <SC.Card open={open} ref={ref} tabIndex={-1}>
      <CSC.Close onClick={() => onClose()} />
      {!userCreated ? (
        <>
          <CSC.ModalTitle>New User</CSC.ModalTitle>
          <SC.FormWrapper>
            <BaseJsonForm
              schema={schema}
              uischema={uischema}
              data={data}
              onChange={({ errors: _errors, data: _data }) => {
                if (_errors) {
                  setErrors(_errors);
                }
                setData(_data);
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

export default CreateUserForm;
