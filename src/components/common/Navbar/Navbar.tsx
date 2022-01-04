import { Container, IconButton, Box, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import navbarBg from '@assets/navbar.svg';
import companyLogo from '@assets/company-logo.svg';
import burguer from '@assets/burguer.svg';
import { useAuthContext } from '@hooks/useAuthContext';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { trackEvent } from '@utils/analytics';
import { sendIntercomMessage } from '@utils/intercom';
import UserMenu from '../UserMenu/UserMenu';
import UserDrawerMobile from '../UserDrawerMobile';

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
  cursor: pointer;
`;

const StyledLinkContainer = styled(Box)`
  margin-right: -72px;

  & > * {
    margin-right: 72px;
  }
`;

const openSupportMessage = () => {
  trackEvent('Support Link Clicked', 'Header');
  window.Intercom('showNewMessage', 'Hi, Fusebit team. I have a question!');
  sendIntercomMessage();
};

interface Props {
  hideUserMenu?: boolean;
  logoUrl?: string;
}

const Navbar: React.FC<Props> = ({ children, hideUserMenu, logoUrl }) => {
  const { userData } = useAuthContext();
  const { getRedirectLink } = useGetRedirectLink();
  const isMobile = useMediaQuery('(max-width: 880px)');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const logoProps = isMobile
    ? {
        height: 40,
        width: 40,
      }
    : {
        height: 56,
        width: 56,
      };

  const rootUrl = logoUrl || getRedirectLink('/integrations/overview');

  const DynamicLink: React.FC = ({ children: innerChildren }) => {
    if (logoUrl) {
      return (
        <a href={rootUrl} target="_blank" rel="noreferrer">
          {innerChildren}
        </a>
      );
    }

    return <Link to={rootUrl}>{innerChildren}</Link>;
  };

  return (
    <>
      <UserDrawerMobile open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      <StyledContainerRoot>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Box mr={isMobile ? '16px' : '24px'}>
                <DynamicLink>
                  <IconButton disableRipple style={logoProps}>
                    <img src={companyLogo} alt="company logo" {...logoProps} />
                  </IconButton>
                </DynamicLink>
              </Box>
              <Box display="flex" flexDirection="column">
                <DynamicLink>
                  <StyledCompany>{userData.company}</StyledCompany>
                </DynamicLink>
                {children}
              </Box>
            </Box>
            {isMobile ? (
              <IconButton size="small" onClick={() => setMobileDrawerOpen(true)}>
                <img src={burguer} alt="burguer" height="10" width="20" />
              </IconButton>
            ) : (
              <StyledLinkContainer display="flex" alignItems="center">
                <StyledLink onClick={() => openSupportMessage()}>Support</StyledLink>
                <StyledLink
                  href="https://developer.fusebit.io"
                  target="_blank"
                  onClick={() => {
                    trackEvent('Docs Link Clicked', 'Header');
                  }}
                >
                  Docs
                </StyledLink>
                {!hideUserMenu && <UserMenu />}
              </StyledLinkContainer>
            )}
          </Box>
        </Container>
      </StyledContainerRoot>
    </>
  );
};

export default Navbar;
