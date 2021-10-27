/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Container, Button, Menu, Drawer } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Link, useHistory, useParams } from 'react-router-dom';
import * as SC from './styles';
import accountImg from '../../../assets/account.svg';
import rightArrow from '../../../assets/arrow-right-black.svg';
import { Props } from '../../../interfaces/Navbar';
import arrow from '../../../assets/down-arrow-white.svg';
import check from '../../../assets/check.svg';
import { signOut, useAuthContext } from '../../../hooks/useAuthContext';
import { useAccountIntegrationsGetAll } from '../../../hooks/api/v2/account/integration/useGetAll';
import { useAccountConnectorsGetAll } from '../../../hooks/api/v2/account/connector/useGetAll';
import { Integration } from '../../../interfaces/integration';
import { Connector } from '../../../interfaces/connector';

import burguer from '../../../assets/burguer.svg';
import cross from '../../../assets/cross.svg';

import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';

// TODO: Refactor, split and remove nested ternary expressions

const Navbar: React.FC<Props> = ({
  sectionName,
  dropdown,
  integration,
  connector,
  authentication,
  team,
  authenticationLink,
  integrationsLink,
}) => {
  const history = useHistory();
  const [anchorSectionDropdown, setAnchorSectionDropdown] = React.useState(null);
  const [anchorUserDropdown, setAnchorUserDropdown] = React.useState(null);
  const { userData } = useAuthContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerBottomOpen, setDrawerBottomOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { getRedirectLink } = useGetRedirectLink();
  const { accountId } = useParams<{ accountId: string }>();

  const { data: integrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { data: connectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  useEffect(() => {
    const unlisten = history.listen(() => {
      setAnchorSectionDropdown(null);
      setDrawerOpen(false);
    });

    return () => unlisten();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    setDrawerOpen(false);
    setAnchorUserDropdown(null);
    setTimeout(() => {
      signOut();
    }, 250);
  };

  const to = integrationsLink
    ? getRedirectLink('/integrations/overview')
    : authenticationLink
    ? `/account/${accountId}/settings`
    : getRedirectLink('/connectors/overview');

  const handleOnClickEmail = () => {
    history.push(getRedirectLink(`/authentication/${userData.userId}/overview`));
  };

  return (
    <SC.Background>
      <Container maxWidth="lg">
        <SC.Nav>
          <Link to={getRedirectLink('/integrations/overview')}>
            <SC.CompanyImg />
          </Link>
          <SC.FlexDown>
            <SC.Flex>
              <Link to={getRedirectLink('/integrations/overview')}>
                <SC.CompanyName>{userData.company}</SC.CompanyName>
              </Link>
            </SC.Flex>
            {dropdown ? (
              <>
                <SC.Flex>
                  {sectionName !== 'Integrations' && sectionName !== 'Connectors' && (
                    <Link to={to}>
                      <SC.Flex mobileHidden>
                        <SC.SectionLink>
                          {integrationsLink ? 'Integrations' : authenticationLink ? 'Authentication' : 'Connectors'}
                        </SC.SectionLink>
                        <SC.Arrow />
                      </SC.Flex>
                    </Link>
                  )}
                  <SC.SectionDropdown
                    active={Boolean(anchorSectionDropdown)}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event: any) => setAnchorSectionDropdown(event.currentTarget)}
                  >
                    {sectionName !== 'Integrations' && sectionName !== 'Connectors' && (
                      <SC.SectionName>
                        {integration
                          ? `${sectionName} Integration`
                          : connector
                          ? `${sectionName} Connector`
                          : sectionName}
                      </SC.SectionName>
                    )}
                    {(sectionName === 'Integrations' || sectionName === 'Connectors') && (
                      <SC.SectionName>{sectionName}</SC.SectionName>
                    )}
                    <img src={arrow} alt="arrow" />
                  </SC.SectionDropdown>
                  <SC.SectionDropdownMobile
                    active={drawerBottomOpen}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={() => setDrawerBottomOpen(true)}
                  >
                    {sectionName !== 'Integrations' && sectionName !== 'Connectors' && (
                      <SC.SectionName>
                        {integration
                          ? `${sectionName} Integration`
                          : connector
                          ? `${sectionName} Connector`
                          : sectionName}
                      </SC.SectionName>
                    )}
                    {(sectionName === 'Integrations' || sectionName === 'Connectors') && (
                      <SC.SectionName>{sectionName}</SC.SectionName>
                    )}
                    <img src={arrow} alt="arrow" />
                  </SC.SectionDropdownMobile>
                </SC.Flex>
                {!authentication ? (
                  <SC.MenuWrapper>
                    <Menu
                      style={{ top: '100px' }}
                      id="simple-menu"
                      anchorEl={anchorSectionDropdown}
                      keepMounted
                      open={Boolean(anchorSectionDropdown)}
                      onClose={() => setAnchorSectionDropdown(null)}
                    >
                      <SC.SectionDropdownMenu>
                        <SC.Flex>
                          <Link style={{ marginRight: 'auto' }} to={getRedirectLink('/integrations/overview')}>
                            <SC.SectionDropdownTitle>Integrations</SC.SectionDropdownTitle>
                          </Link>
                          <Link to={getRedirectLink('/integrations/overview')}>
                            <SC.SectionDropdownSeeMore>
                              See all
                              <img src={rightArrow} alt="See all" height="8" width="8" />
                            </SC.SectionDropdownSeeMore>
                          </Link>
                        </SC.Flex>
                        {integrations?.data?.items?.map((_integration) => (
                          <Link key={_integration.id} to={getRedirectLink(`/integration/${_integration.id}/develop`)}>
                            <SC.SectionDropdownIntegration active={sectionName === _integration.id}>
                              {_integration.id}
                              <img src={check} alt="check" height="16" width="16" />
                            </SC.SectionDropdownIntegration>
                          </Link>
                        ))}
                        <SC.Flex>
                          <Link style={{ marginRight: 'auto' }} to={getRedirectLink('/connectors/overview')}>
                            <SC.SectionDropdownTitle>Connectors</SC.SectionDropdownTitle>
                          </Link>
                          <Link to={getRedirectLink('/connectors/overview')}>
                            <SC.SectionDropdownSeeMore>
                              See all
                              <img src={rightArrow} alt="See all" height="8" width="8" />
                            </SC.SectionDropdownSeeMore>
                          </Link>
                        </SC.Flex>
                        {connectors?.data?.items?.map((_connector) => (
                          <Link key={_connector.id} to={getRedirectLink(`/connector/${_connector.id}/configure`)}>
                            <SC.SectionDropdownIntegration active={sectionName === _connector.id}>
                              {_connector.id}
                              <img src={check} alt="check" height="16" width="16" />
                            </SC.SectionDropdownIntegration>
                          </Link>
                        ))}
                      </SC.SectionDropdownMenu>
                    </Menu>
                    <Drawer anchor="bottom" open={drawerBottomOpen} onClose={() => setDrawerBottomOpen(false)}>
                      <SC.SectionDropdownMenu>
                        <SC.Flex>
                          <Link style={{ marginRight: 'auto' }} to={getRedirectLink('/integrations/overview')}>
                            <SC.SectionDropdownTitle>Integrations</SC.SectionDropdownTitle>
                          </Link>
                          <Link to={getRedirectLink('/integrations/overview')}>
                            <SC.SectionDropdownSeeMore>
                              See all
                              <img src={rightArrow} alt="See all" height="8" width="8" />
                            </SC.SectionDropdownSeeMore>
                          </Link>
                        </SC.Flex>
                        {integrations?.data?.items?.map((_integration) => (
                          <Link key={_integration.id} to={getRedirectLink(`/integration/${_integration.id}/develop`)}>
                            <SC.SectionDropdownIntegration active={sectionName === _integration.id}>
                              {_integration.id}
                              <img src={check} alt="check" height="16" width="16" />
                            </SC.SectionDropdownIntegration>
                          </Link>
                        ))}
                        <SC.Flex>
                          <Link style={{ marginRight: 'auto' }} to={getRedirectLink('/connectors/overview')}>
                            <SC.SectionDropdownTitle>Connectors</SC.SectionDropdownTitle>
                          </Link>
                          <Link to={getRedirectLink('/connectors/overview')}>
                            <SC.SectionDropdownSeeMore>
                              See all
                              <img src={rightArrow} alt="See all" height="8" width="8" />
                            </SC.SectionDropdownSeeMore>
                          </Link>
                        </SC.Flex>
                        {connectors?.data?.items?.map((_connector) => (
                          <Link key={_connector.id} to={getRedirectLink(`/connector/${_connector.id}/configure`)}>
                            <SC.SectionDropdownIntegration active={sectionName === _connector.id}>
                              {_connector.id}
                              <img src={check} alt="check" height="16" width="16" />
                            </SC.SectionDropdownIntegration>
                          </Link>
                        ))}
                      </SC.SectionDropdownMenu>
                    </Drawer>
                  </SC.MenuWrapper>
                ) : (
                  <SC.MenuWrapper>
                    <Menu
                      style={{ top: '100px' }}
                      id="simple-menu"
                      anchorEl={anchorSectionDropdown}
                      keepMounted
                      open={Boolean(anchorSectionDropdown)}
                      onClose={() => setAnchorSectionDropdown(null)}
                    >
                      <SC.SectionDropdownMenu>
                        <SC.Flex>
                          <Link style={{ marginRight: 'auto' }} to={getRedirectLink('/connectors/overview')}>
                            <SC.SectionDropdownTitle>Accounts</SC.SectionDropdownTitle>
                          </Link>
                          <Link to={`/account/${accountId}/settings`}>
                            <SC.SectionDropdownSeeMore>
                              See all
                              <img src={rightArrow} alt="See all" height="8" width="8" />
                            </SC.SectionDropdownSeeMore>
                          </Link>
                        </SC.Flex>
                        <Link
                          to={`/account/${userData.accountId}/subscription/${userData.subscriptionId}/authentication/detail`}
                        >
                          <SC.SectionDropdownIntegration active>
                            {userData.primaryEmail}
                            <img src={check} alt="check" height="16" width="16" />
                          </SC.SectionDropdownIntegration>
                        </Link>
                      </SC.SectionDropdownMenu>
                    </Menu>
                    <Drawer anchor="bottom" open={drawerBottomOpen} onClose={() => setDrawerBottomOpen(false)}>
                      <SC.SectionDropdownMenu>
                        <SC.Flex>
                          <Link style={{ marginRight: 'auto' }} to={`/account/${accountId}/settings`}>
                            <SC.SectionDropdownTitle>Accounts</SC.SectionDropdownTitle>
                          </Link>
                          <Link to={`/account/${accountId}/settings`}>
                            <SC.SectionDropdownSeeMore>
                              See all
                              <img src={rightArrow} alt="See all" height="8" width="8" />
                            </SC.SectionDropdownSeeMore>
                          </Link>
                        </SC.Flex>
                        <Link
                          to={`/account/${userData.accountId}/subscription/${userData.subscriptionId}/authentication/detail`}
                        >
                          <SC.SectionDropdownIntegration active>
                            {userData.primaryEmail}
                            <img src={check} alt="check" height="16" width="16" />
                          </SC.SectionDropdownIntegration>
                        </Link>
                      </SC.SectionDropdownMenu>
                    </Drawer>
                  </SC.MenuWrapper>
                )}
              </>
            ) : (
              <Link
                to={
                  integration
                    ? getRedirectLink('/integrations/overview')
                    : authentication
                    ? `/account/${accountId}/settings`
                    : team
                    ? `/account/${accountId}/team`
                    : getRedirectLink('/connectors/overview')
                }
              >
                <SC.SectionLink>{sectionName}</SC.SectionLink>
              </Link>
            )}
          </SC.FlexDown>
          <SC.LinksContainer>
            <SC.LinkA href="https://fusebit.io/contact">Support</SC.LinkA>
            <SC.LinkA href="https://developer.fusebit.io">Docs</SC.LinkA>
          </SC.LinksContainer>
          <SC.ButtonWrapper active={Boolean(anchorUserDropdown) && !loggingOut}>
            <Button
              style={{ backgroundColor: Boolean(anchorUserDropdown) && !loggingOut ? '#D7E5FF66' : '' }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(event: any) => setAnchorUserDropdown(event.currentTarget)}
              size="large"
              startIcon={<SC.User src={userData.picture || accountImg} />}
              endIcon={Boolean(anchorUserDropdown) && !loggingOut ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              variant="text"
              color="inherit"
            >
              {process.env.REACT_APP_DEPLOYMENT_KEY}
            </Button>
            <Menu
              style={{ top: '100px', margin: '0 0 0 -88px' }}
              id="simple-menu"
              anchorEl={anchorUserDropdown}
              keepMounted
              open={Boolean(anchorUserDropdown) && !loggingOut}
              onClose={() => setAnchorUserDropdown(null)}
            >
              <SC.UserDropdown>
                <SC.UserDropdownCompany>{userData.company}</SC.UserDropdownCompany>
                <SC.UserDropdownInfo onClick={handleOnClickEmail}>
                  <SC.UserDropdownInfoImage src={userData.picture || accountImg} alt="user" height="38" width="38" />
                  <SC.UserDropdownPersonalInfo>
                    <SC.UserDropdownInfoName>
                      {userData.firstName} {userData.lastName}
                    </SC.UserDropdownInfoName>
                    <SC.UserDropdownInfoEmail>{userData.primaryEmail}</SC.UserDropdownInfoEmail>
                  </SC.UserDropdownPersonalInfo>
                </SC.UserDropdownInfo>
                <Link to={getRedirectLink('/integrations/overview')}>
                  <SC.UserDropdownStatus>
                    <div>
                      <SC.UserDropdownStatusTitle>{process.env.REACT_APP_DEPLOYMENT_KEY}</SC.UserDropdownStatusTitle>
                      <SC.UserDropdownStatusId>{userData.subscriptionId}</SC.UserDropdownStatusId>
                    </div>
                    <SC.UserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
                  </SC.UserDropdownStatus>
                </Link>
                <SC.UserDropdownLinksWrapper>
                  <Link to={`/account/${accountId}/settings`}>
                    <SC.UserDropdownLink>Settings</SC.UserDropdownLink>
                  </Link>
                  <Link to={`/account/${accountId}/team`}>
                    <SC.UserDropdownLink noMargin>Team</SC.UserDropdownLink>
                  </Link>
                </SC.UserDropdownLinksWrapper>
                <SC.UserButtonWrapper>
                  <Button
                    onClick={handleLogout}
                    style={{ marginLeft: 'auto' }}
                    variant="outlined"
                    size="medium"
                    color="primary"
                  >
                    Log Out
                  </Button>
                </SC.UserButtonWrapper>
              </SC.UserDropdown>
            </Menu>
          </SC.ButtonWrapper>
          <SC.Menu onClick={() => setDrawerOpen(true)} src={burguer} alt="menu-opener" height="10" width="20" />
          <Drawer anchor="right" open={drawerOpen && !loggingOut} onClose={() => setDrawerOpen(false)}>
            <SC.DrawerWrapper>
              <SC.Flex>
                <SC.CompanyName>{userData.company}</SC.CompanyName>
                <SC.Cross onClick={() => setDrawerOpen(false)} src={cross} alt="close" height="10" width="10" />
              </SC.Flex>

              <SC.UserDropdownInfo>
                <SC.UserDropdownInfoImage src={userData.picture || accountImg} alt="user" height="38" width="38" />
                <SC.UserDropdownPersonalInfo>
                  <SC.UserDropdownInfoName>
                    {userData.firstName} {userData.lastName}
                  </SC.UserDropdownInfoName>
                  <SC.UserDropdownInfoEmail>{userData.primaryEmail}</SC.UserDropdownInfoEmail>
                </SC.UserDropdownPersonalInfo>
              </SC.UserDropdownInfo>

              <Link to={getRedirectLink('/integrations/overview')}>
                <SC.UserDropdownStatus>
                  <div>
                    <SC.UserDropdownStatusTitle>{process.env.REACT_APP_DEPLOYMENT_KEY}</SC.UserDropdownStatusTitle>
                    <SC.UserDropdownStatusId>{userData.subscriptionId}</SC.UserDropdownStatusId>
                  </div>
                  <SC.UserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
                </SC.UserDropdownStatus>
              </Link>
              <SC.UserDropdownLinksWrapper>
                <Link to={`/account/${accountId}/settings`}>
                  <SC.UserDropdownLink>Settings</SC.UserDropdownLink>
                </Link>
                <Link to={`/account/${accountId}/team`}>
                  <SC.UserDropdownLink noMargin>Team</SC.UserDropdownLink>
                </Link>
              </SC.UserDropdownLinksWrapper>

              <SC.Br />

              <SC.UserDropdownLinksWrapper>
                <SC.UserDropdownLinkA href="https://fusebit.io/contact">Support</SC.UserDropdownLinkA>
                <SC.UserDropdownLinkA href="https://developer.fusebit.io">Docs</SC.UserDropdownLinkA>
              </SC.UserDropdownLinksWrapper>

              <SC.UserButtonWrapper>
                <Button
                  onClick={handleLogout}
                  style={{ marginLeft: 'auto', marginTop: '80px' }}
                  variant="outlined"
                  size="medium"
                  color="primary"
                >
                  Log Out
                </Button>
              </SC.UserButtonWrapper>
            </SC.DrawerWrapper>
          </Drawer>
        </SC.Nav>
      </Container>
    </SC.Background>
  );
};

export default Navbar;
