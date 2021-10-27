import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link as MUILink, Divider } from '@material-ui/core';

const StyledUserDropdownLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: -16px;

  & > * {
    margin-bottom: 16px;
  }
`;

const StyledUserDropdownLink = styled.span<{ noMargin?: boolean }>`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: none;
  width: max-content;
  transition: all 0.25s linear;

  &:hover {
    color: var(--primary-color);
  }
`;

const StyledDivider = styled(Divider)`
  margin: 32px 0;
  height: 1px;
  width: 152px;
  background-color: rgb(149, 149, 149);
`;

interface Props {
  showAll?: boolean;
}

const UserMenuLinks: React.FC<Props> = ({ showAll }) => {
  const { accountId } = useParams<{ accountId: string }>();

  return (
    <>
      <StyledUserDropdownLinksWrapper>
        <Link to={`/account/${accountId}/settings`}>
          <StyledUserDropdownLink>Settings</StyledUserDropdownLink>
        </Link>
        <Link to={`/account/${accountId}/team`}>
          <StyledUserDropdownLink>Team</StyledUserDropdownLink>
        </Link>
      </StyledUserDropdownLinksWrapper>
      {showAll && (
        <>
          <StyledDivider />
          <StyledUserDropdownLinksWrapper>
            <MUILink underline="none" href="https://fusebit.io/contact">
              <StyledUserDropdownLink>Support</StyledUserDropdownLink>
            </MUILink>
            <MUILink underline="none" href="https://developer.fusebit.io">
              <StyledUserDropdownLink>Docs</StyledUserDropdownLink>
            </MUILink>
          </StyledUserDropdownLinksWrapper>
        </>
      )}
    </>
  );
};

export default UserMenuLinks;
