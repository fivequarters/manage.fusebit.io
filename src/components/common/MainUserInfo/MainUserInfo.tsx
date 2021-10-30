import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import accountImg from '../../../assets/account.svg';
import rightArrow from '../../../assets/arrow-right-black.svg';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';

const StyledUserDropdownInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  cursor: pointer;

  @media only screen and (max-width: 880px) {
    margin-top: 48px;
  }
`;

const StyledUserDropdownInfoImage = styled.img`
  height: 38px;
  width: 38px;
  object-fit: contain;
  border-radius: 50%;
  margin-right: 16px;
`;

const StyledUserDropdownPersonalInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserDropdownInfoName = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
  margin-top: auto;
`;

const StyledUserDropdownInfoEmail = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  margin-bottom: auto;
`;

const StyledUserDropdownStatus = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  border-radius: 4px;
  background-color: var(--secondary-color);
  text-decoration: none;
  margin-bottom: 24px;

  &:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 880px) {
    width: 238px;
  }
`;

const StyledUserDropdownStatusTitle = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 8px;
`;

const StyledUserDropdownStatusId = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);

  @media only screen and (max-width: 880px) {
    width: 155px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const StyledUserDropdownStatusArrow = styled.img`
  height: 12px;
  width: 12px;
  object-fit: contain;
  margin-left: auto;
`;

const MainUserInfo = () => {
  const { userData } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();

  const handleOnClickEmail = () => {
    history.push(getRedirectLink(`/authentication/${userData.userId}/overview`));
  };

  return (
    <>
      <StyledUserDropdownInfo onClick={handleOnClickEmail}>
        <StyledUserDropdownInfoImage src={userData.picture || accountImg} alt="user" height="38" width="38" />
        <StyledUserDropdownPersonalInfo>
          <StyledUserDropdownInfoName>
            {userData.firstName} {userData.lastName}
          </StyledUserDropdownInfoName>
          <StyledUserDropdownInfoEmail>{userData.primaryEmail}</StyledUserDropdownInfoEmail>
        </StyledUserDropdownPersonalInfo>
      </StyledUserDropdownInfo>
      <Link to={getRedirectLink('/integrations/overview')}>
        <StyledUserDropdownStatus>
          <div>
            <StyledUserDropdownStatusTitle>{process.env.REACT_APP_DEPLOYMENT_KEY}</StyledUserDropdownStatusTitle>
            <StyledUserDropdownStatusId>{userData.subscriptionId}</StyledUserDropdownStatusId>
          </div>
          <StyledUserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
        </StyledUserDropdownStatus>
      </Link>
    </>
  );
};

export default MainUserInfo;
