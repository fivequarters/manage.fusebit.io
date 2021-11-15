import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { ValidationMode } from '@jsonforms/core';
import { useHistory, useParams } from 'react-router-dom';
import dots from '@assets/dots.svg';
import { useAuthContext } from '@hooks/useAuthContext';
import CliAccessModal from '@components/AuthenticationDetailOverview/CliAccessModal';
import { useAccountUserGetOne } from '@hooks/api/v1/account/user/useGetOne';
import { useAccountUserUpdateOne } from '@hooks/api/v1/account/user/useUpdateOne';
import accountImg from '@assets/account.svg';
import { Operation } from '@interfaces/operation';
import { Account } from '@interfaces/account';
import { useLoader } from '@hooks/useLoader';
import { useError } from '@hooks/useError';
import { useAccountUserDeleteOne } from '@hooks/api/v1/account/user/useDeleteOne';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useCopy } from '@hooks/useCopy';
import { startCase } from '@utils/utils';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
import BaseJsonForm from '@components/common/BaseJsonForm';
import styled from 'styled-components';
import * as CSC from '@components/globalStyle';

const StyledOverview = styled.div`
  display: flex;
  padding-bottom: 60px;

  @media only screen and (max-width: 780px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledFlexDown = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledUserCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 42px;
  height: 550px;
  width: 520px;
  box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
  z-index: 0;
  border-radius: 8px;

  @media only screen and (max-width: 780px) {
    width: 100%;
    height: 100%;
  }

  @media only screen and (max-width: 370px) {
    padding: 16px;
  }
`;

const StyledUserInfoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 54px;
`;

const StyledDotsWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 12px;
  padding: 0 10px;

  &:hover {
    cursor: pointer;
  }
`;

const StyledDots = styled.img`
  height: 20px;
  width: 4px;
  object-fit: contain;
`;

const StyledUserImage = styled.img`
  height: 88px;
  width: 88px;
  object-fit: contain;
  border-radius: 50%;
  margin-right: 32px;

  @media only screen and (max-width: 780px) {
    display: none;
  }
`;

const StyledUserName = styled.h3`
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  margin-bottom: 4px;
  margin-top: 0;
`;

const StyledUserCompany = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 10px;
`;

const StyledUserId = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  width: 100%;

  strong {
    font-weight: 700;
  }
`;

const StyledCopySuccess = styled.p<{ copy: boolean }>`
  position: absolute;
  left: 120px;
  bottom: -35px;
  font-size: 14px;
  line-height: 16px;
  color: var(--grey);
  opacity: ${(props) => (props.copy ? 1 : 0)};
  visibility: ${(props) => (props.copy ? 'visible' : 'hidden')};
  margin-left: auto;
  transition: all 0.5s linear;

  @media only screen and (max-width: 780px) {
    left: 0;
  }
`;

const StyledEditButtonWrapper = styled.div`
  margin-top: 48px;
`;

const StyledCLIAccesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 59px;
  margin-top: 52px;

  @media only screen and (max-width: 780px) {
    align-items: center;
    margin-left: 0;
  }
`;

const StyledCLIAccess = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin: 0;
  margin-bottom: 40px;
`;

const StyledFormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 316px;
`;

const StyledFormInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const StyledPopperOpen = styled.div<{ active: boolean }>`
  position: absolute;
  right: 0;
  width: 215px;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  margin-left: -170px;
  margin-top: 10px;
  opacity: ${(props) => (props.active ? 1 : 0)};
  visibility: ${(props) => (props.active ? 'visible' : 'hidden')};
  z-index: 100;
  transition: all 0.2s linear;

  &:hover {
    cursor: default;
  }
`;

const StyledPopperElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  text-decoration: none;
  text-align: center;
  color: var(--black);
  margin-bottom: 5px;
  transition: all 0.25s linear;

  &:hover {
    background-color: var(--secondary-color);
    cursor: pointer;
  }

  & > img {
    margin-left: auto;
    display: none;
  }
`;

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
      label: 'E-mail',
      options: {
        hideRequiredAsterisk: true,
      },
    },
  ],
};

const Overview: React.FC = () => {
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useAuthContext();
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

  const isAdmin = userData.userId === accountData?.data.id;

  return (
    <StyledOverview
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
      <CliAccessModal open={cliOpen} onClose={() => setCliOpen(false)} />
      {accountData?.data.id === userId ? (
        <StyledUserCard>
          <StyledUserInfoContainer>
            <div onClick={() => setPopperOpen(true)}>
              <StyledDotsWrapper id="popper" onClick={() => setPopperOpen(true)}>
                <StyledDots
                  id="popperDots"
                  onClick={() => setPopperOpen(true)}
                  src={dots}
                  alt="options"
                  height="20"
                  width="4"
                />
              </StyledDotsWrapper>
              <StyledPopperOpen id="popperWrapper" active={popperOpen}>
                {accountData?.data.id !== userData.userId && (
                  <StyledPopperElement onClick={() => setDeleteOpen(true)}>Delete User</StyledPopperElement>
                )}
              </StyledPopperOpen>
            </div>
            <StyledUserImage alt="user" src={isAdmin ? userData.picture : accountImg} height="88" width="88" />

            <StyledFlexDown>
              <StyledUserName>
                {accountData?.data.firstName} {accountData?.data.lastName}
              </StyledUserName>
              <StyledUserCompany>{accountData?.data.primaryEmail} </StyledUserCompany>
              <StyledUserId>
                <strong>User-ID:&nbsp;</strong> {accountData?.data.id}{' '}
                <CSC.Copy margin="0 6px 0 auto" onClick={() => handleCopy(accountData?.data.id || '')} />
              </StyledUserId>
              <StyledCopySuccess copy={copiedLine}>Copied to clipboard!</StyledCopySuccess>
            </StyledFlexDown>
          </StyledUserInfoContainer>
          {!editInformation ? (
            <>
              <CSC.InfoFieldWrapper>
                <CSC.InfoFieldPlaceholder>First Name</CSC.InfoFieldPlaceholder>
                <CSC.InfoField>{data?.firstName}</CSC.InfoField>
              </CSC.InfoFieldWrapper>
              <CSC.InfoFieldWrapper>
                <CSC.InfoFieldPlaceholder>Last Name</CSC.InfoFieldPlaceholder>
                <CSC.InfoField>{data?.lastName}</CSC.InfoField>
              </CSC.InfoFieldWrapper>
              <CSC.InfoFieldWrapper>
                <CSC.InfoFieldPlaceholder>E-mail</CSC.InfoFieldPlaceholder>
                <CSC.InfoField>{data?.primaryEmail}</CSC.InfoField>
              </CSC.InfoFieldWrapper>
              <StyledEditButtonWrapper>
                <Button
                  onClick={() => setEditInformation(true)}
                  fullWidth={false}
                  size="medium"
                  color="primary"
                  variant="outlined"
                >
                  Edit information
                </Button>
              </StyledEditButtonWrapper>
            </>
          ) : (
            <StyledFormWrapper>
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
              <StyledFormInputWrapper>
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
              </StyledFormInputWrapper>
            </StyledFormWrapper>
          )}
        </StyledUserCard>
      ) : (
        <StyledUserCard>
          <CSC.LoaderContainer>
            <CSC.Spinner />
          </CSC.LoaderContainer>
        </StyledUserCard>
      )}
      <StyledCLIAccesWrapper>
        <StyledCLIAccess>Command Line (CLI) Access</StyledCLIAccess>
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
      </StyledCLIAccesWrapper>
    </StyledOverview>
  );
};

export default Overview;
