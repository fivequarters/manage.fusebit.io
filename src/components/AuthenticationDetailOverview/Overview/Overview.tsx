import React, { useEffect } from 'react';
import { Button, Modal, Backdrop } from '@material-ui/core';
import { JsonForms } from '@jsonforms/react';
import { ValidationMode } from '@jsonforms/core';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';

import { useHistory, useParams } from 'react-router-dom';
import dots from '../../../assets/dots.svg';
import { useContext } from '../../../hooks/useContext';
import * as CSC from '../../globalStyle';
import * as SC from './styles';
import CliAccess from '../CliAccess';
import { useAccountUserGetOne } from '../../../hooks/api/v1/account/user/useGetOne';
import { useAccountUserUpdateOne } from '../../../hooks/api/v1/account/user/useUpdateOne';
import client from '../../../assets/client.jpg';
import { Operation } from '../../../interfaces/operation';
import { Account } from '../../../interfaces/account';
import { useLoader } from '../../../hooks/useLoader';
import { useError } from '../../../hooks/useError';
import { useAccountUserDeleteOne } from '../../../hooks/api/v1/account/user/useDeleteOne';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { useCopy } from '../../../hooks/useCopy';
import { startCase } from '../../../utils/utils';
import ConfirmationPrompt from '../../common/ConfirmationPrompt';

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

const Overview: React.FC = () => {
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useContext();
  const [editInformation, setEditInformation] = React.useState(false);
  const [data, setData] = React.useState<Account>();
  const { data: accountData, refetch: reloadAccount } = useAccountUserGetOne<Account>({
    enabled: userData.token,
    userId,
    accountId: userData.accountId,
  });
  const updateUser = useAccountUserUpdateOne<Operation>();
  const [errors, setErrors] = React.useState<object[]>([]);
  const [validationMode, setValidationMode] = React.useState<ValidationMode>('ValidateAndHide');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [cliOpen, setCliOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [popperOpen, setPopperOpen] = React.useState(false);
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const deleteAccount = useAccountUserDeleteOne<Operation>();
  const { getRedirectLink } = useGetRedirectLink();
  const { handleCopy, copiedLine } = useCopy();

  useEffect(() => {
    if (accountData && accountData.data) {
      setData(accountData.data);
    }
  }, [accountData]);

  const _updateUser = async (_data: Account) => {
    try {
      await updateUser.mutateAsync({ _data, accountId: userData.accountId, userId: _data.id });
      reloadAccount();
    } catch (e) {
      createError(e);
    }
  };

  const handleSubmit = async () => {
    if (errors.length > 0) {
      setValidationMode('ValidateAndShow');
    } else {
      // update the user info
      setIsSubmitting(true);
      const dataToSubmit: Account = {
        id: accountData?.data.id || '',
        firstName: startCase(data?.firstName || ''),
        lastName: startCase(data?.lastName || ''),
        primaryEmail: data?.primaryEmail?.toLowerCase(),
      };
      await _updateUser(dataToSubmit);
      setEditInformation(false);
      setIsSubmitting(false);
      setValidationMode('ValidateAndHide');
    }
  };

  const handleCancel = () => {
    setEditInformation(false);
    setIsSubmitting(false);
    setData(accountData?.data);
  };

  const handleDelete = async () => {
    try {
      createLoader();
      await deleteAccount.mutateAsync({ userId: accountData?.data.id, accountId: userData.accountId });
      history.push(getRedirectLink('/authentication/users'));
      // window.location.href = getRedirectLink('/authentication');
    } catch (e) {
      createError(e);
      setDeleteOpen(false);
    } finally {
      removeLoader();
    }
  };

  return (
    <SC.Overview
      onClick={(e: any) =>
        e.target.id !== 'popper' &&
        e.target.id !== 'popperWrapper' &&
        e.target.id !== 'popperDots' &&
        setPopperOpen(false)
      }
    >
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title="Are you sure you want to delete this user?"
        description="Deleting this user will remove all of their access to Fusebit. You will have to re-add them again"
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={cliOpen}
        onClose={() => setCliOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <CliAccess open={cliOpen} onClose={() => setCliOpen(false)} />
      </Modal>
      {accountData?.data.id === userId ? (
        <SC.UserCard>
          <SC.UserInfoContainer>
            <div onClick={() => setPopperOpen(true)}>
              <SC.DotsWrapper id="popper" onClick={() => setPopperOpen(true)}>
                <SC.Dots
                  id="popperDots"
                  onClick={() => setPopperOpen(true)}
                  src={dots}
                  alt="options"
                  height="20"
                  width="4"
                />
              </SC.DotsWrapper>
              <SC.PopperOpen id="popperWrapper" active={popperOpen}>
                {accountData?.data.id !== userData.userId && (
                  <SC.PopperElement onClick={() => setDeleteOpen(true)}>Delete User</SC.PopperElement>
                )}
              </SC.PopperOpen>
            </div>
            <SC.UserImage alt="user" src={client} height="88" width="88" />
            <SC.FlexDown>
              <SC.UserName>
                {accountData?.data.firstName} {accountData?.data.lastName}
              </SC.UserName>
              <SC.UserCompany>{accountData?.data.primaryEmail} </SC.UserCompany>
              <SC.UserId>
                <strong>User-ID:&nbsp;</strong> {accountData?.data.id}{' '}
                <CSC.Copy margin="0 6px 0 auto" onClick={() => handleCopy(accountData?.data.id || '')} />
              </SC.UserId>
              <SC.CopySuccess copy={copiedLine}>Copied to clipboard!</SC.CopySuccess>
            </SC.FlexDown>
          </SC.UserInfoContainer>
          {!editInformation ? (
            <>
              <SC.InfoFieldWrapper>
                <SC.InfoFieldPlaceholder>First Name</SC.InfoFieldPlaceholder>
                <SC.InfoField>{data?.firstName}</SC.InfoField>
              </SC.InfoFieldWrapper>
              <SC.InfoFieldWrapper>
                <SC.InfoFieldPlaceholder>Last Name</SC.InfoFieldPlaceholder>
                <SC.InfoField>{data?.lastName}</SC.InfoField>
              </SC.InfoFieldWrapper>
              <SC.InfoFieldWrapper>
                <SC.InfoFieldPlaceholder>E-mail</SC.InfoFieldPlaceholder>
                <SC.InfoField>{data?.primaryEmail}</SC.InfoField>
              </SC.InfoFieldWrapper>
              <SC.EditButtonWrapper>
                <Button
                  onClick={() => setEditInformation(true)}
                  fullWidth={false}
                  size="medium"
                  color="primary"
                  variant="outlined"
                >
                  Edit information
                </Button>
              </SC.EditButtonWrapper>
            </>
          ) : (
            <SC.FormWrapper>
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
              <SC.FormInputWrapper>
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
              </SC.FormInputWrapper>
            </SC.FormWrapper>
          )}
        </SC.UserCard>
      ) : (
        <SC.UserCard>
          <CSC.LoaderContainer>
            <CSC.Spinner />
          </CSC.LoaderContainer>
        </SC.UserCard>
      )}
      <SC.CLIAccesWrapper>
        <SC.CLIAccess>Command Line (CLI) Access</SC.CLIAccess>
        <Button
          onClick={() => setCliOpen(true)}
          style={{ width: '200px' }}
          fullWidth={false}
          size="large"
          color="primary"
          variant="contained"
        >
          Grant CLI Access
        </Button>
      </SC.CLIAccesWrapper>
    </SC.Overview>
  );
};

export default Overview;