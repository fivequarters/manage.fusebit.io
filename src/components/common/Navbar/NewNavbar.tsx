import { Container, IconButton, Box, useMediaQuery } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Props } from '../../../interfaces/Navbar';
import { useAuthContext } from '../../../hooks/useAuthContext';
import navbarBg from '../../../assets/navbar.svg';
import companyLogo from '../../../assets/company-logo.svg';

import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import UserMenu from './UserMenu';

const StyledContainerRoot = styled(Box)`
  height: var(--navbar-height);
  display: flex;
  background-image: url(${navbarBg});
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 50px;

  @media only screen and (max-width: 880px) {
    padding-top: 41px;
  }
`;

const StyledCompany = styled(Box)`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  margin: 0 10px 0 0;
  text-decoration: none;

  @media only screen and (max-width: 880px) {
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
  }
`;

const StyledLink = styled.a`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  text-decoration: none;
  color: white;
`;

const StyledLinkContainer = styled(Box)`
  margin-right: -72px;

  & > * {
    margin-right: 72px;
  }
`;

const Navbar: React.FC<Props> = ({ children }) => {
  const { userData } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const matchesMobile = useMediaQuery('(max-width: 880px)');

  const logoProps = matchesMobile
    ? {
        height: 40,
        width: 40,
      }
    : {
        height: 56,
        width: 56,
      };

  return (
    <StyledContainerRoot>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Box mr="24px">
              <Link to={getRedirectLink('/integrations/overview')}>
                <IconButton disableRipple style={logoProps}>
                  <img src={companyLogo} alt="company logo" {...logoProps} />
                </IconButton>
              </Link>
            </Box>
            <Box display="flex" flexDirection="column">
              <Link to={getRedirectLink('/integrations/overview')}>
                <StyledCompany>{userData.company}</StyledCompany>
              </Link>
              {children}
            </Box>
          </Box>
          <StyledLinkContainer display="flex" alignItems="center">
            <StyledLink href="https://fusebit.io/contact">Support</StyledLink>
            <StyledLink href="https://developer.fusebit.io">Docs</StyledLink>
            <UserMenu />
          </StyledLinkContainer>
        </Box>
      </Container>
    </StyledContainerRoot>
  );
};

export default Navbar;
