import React from 'react';
import * as SC from './styles';
import { Container, Button, Menu, Drawer } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import client from '../../assets/client.jpg';
import { Props } from '../../interfaces/Navbar';
import arrow from '../../assets/down-arrow-white.svg';
import rightArrow from '../../assets/arrow-right-black.svg';
import check from '../../assets/check.svg';
import { useContext } from '../../hooks/useContext';
import { useAccountIntegrationsGetAll } from '../../hooks/api/v2/account/integration/useGetAll';
import { useAccountConnectorsGetAll } from '../../hooks/api/v2/account/connector/useGetAll';
import { Integration } from '../../interfaces/integration';
import { Connector } from '../../interfaces/connector';
import { useState } from 'react';
import burguer from '../../assets/burguer.svg';
import cross from '../../assets/cross.svg';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useGetRedirectLink } from '../../hooks/useGetRedirectLink';

const Navbar: React.FC<Props> = ({
  sectionName,
  dropdown,
  integration,
  connector,
  authentication,
  authenticationLink,
  integrationsLink,
}) => {
  const history = useHistory();
  const [anchorSectionDropdown, setAnchorSectionDropdown] = React.useState(null);
  const [anchorUserDropdown, setAnchorUserDropdown] = React.useState(null);
  const { userData, logout } = useContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerBottomOpen, setDrawerBottomOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { getRedirectLink } = useGetRedirectLink();

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
    if (
      (integrations?.error && integrations.error.indexOf('403') >= 0) ||
      (connectors?.error && connectors.error.indexOf('403') >= 0)
    )
      history.push('/fatal-error');
  }, [integrations, connectors, history]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const handleLogout = () => {
    setLoggingOut(true);
    setDrawerOpen(false);
    setAnchorUserDropdown(null);
    setTimeout(() => {
      logout();
    }, 250);
  };

  return (
    <SC.Background>
      <Container maxWidth="lg">
        <SC.Nav>
          <SC.CompanyImg href={getRedirectLink('/integrations')} />
          <SC.FlexDown>
            <SC.Flex>
              <SC.CompanyName href={getRedirectLink('/integrations')}>{userData.company}</SC.CompanyName>
            </SC.Flex>
            {dropdown ? (
              <>
                <SC.Flex>
                  {sectionName !== 'Integrations' && sectionName !== 'Connectors' && (
                    <SC.Flex mobileHidden={true}>
                      <SC.SectionLink
                        href={
                          integrationsLink
                            ? getRedirectLink('/integrations')
                            : authenticationLink
                            ? getRedirectLink('/authentication')
                            : getRedirectLink('/connectors')
                        }
                      >
                        {integrationsLink ? 'Integrations' : authenticationLink ? 'Authentication' : 'Connectors'}
                      </SC.SectionLink>
                      <SC.Arrow />
                    </SC.Flex>
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
                          ? sectionName + ' Integration'
                          : connector
                          ? sectionName + ' Connector'
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
                          ? sectionName + ' Integration'
                          : connector
                          ? sectionName + ' Connector'
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
                          <SC.SectionDropdownTitle>Integrations</SC.SectionDropdownTitle>
                          <SC.SectionDropdownSeeMore href={getRedirectLink('/integrations')}>
                            See all
                            <img src={rightArrow} alt="See all" height="8" width="8" />
                          </SC.SectionDropdownSeeMore>
                        </SC.Flex>
                        {integrations?.data?.items?.map((integration, index) => (
                          <SC.SectionDropdownIntegration
                            key={index}
                            active={sectionName === integration.id}
                            href={getRedirectLink('/integration/' + integration.id)}
                          >
                            {integration.id}
                            <img src={check} alt="check" height="16" width="16" />
                          </SC.SectionDropdownIntegration>
                        ))}
                        <SC.Flex>
                          <SC.SectionDropdownTitle>Connectors</SC.SectionDropdownTitle>
                          <SC.SectionDropdownSeeMore href={getRedirectLink('/connectors')}>
                            See all
                            <img src={rightArrow} alt="See all" height="8" width="8" />
                          </SC.SectionDropdownSeeMore>
                        </SC.Flex>
                        {connectors?.data?.items?.map((connector, index) => (
                          <SC.SectionDropdownIntegration
                            key={index}
                            active={sectionName === connector.id}
                            href={getRedirectLink('/connector/' + connector.id)}
                          >
                            {connector.id}
                            <img src={check} alt="check" height="16" width="16" />
                          </SC.SectionDropdownIntegration>
                        ))}
                      </SC.SectionDropdownMenu>
                    </Menu>
                    <Drawer anchor={'bottom'} open={drawerBottomOpen} onClose={() => setDrawerBottomOpen(false)}>
                      <SC.SectionDropdownMenu>
                        <SC.Flex>
                          <SC.SectionDropdownTitle>Integrations</SC.SectionDropdownTitle>
                          <SC.SectionDropdownSeeMore href={getRedirectLink('/integrations')}>
                            See all
                            <img src={rightArrow} alt="See all" height="8" width="8" />
                          </SC.SectionDropdownSeeMore>
                        </SC.Flex>
                        {integrations?.data?.items?.map((integration, index) => (
                          <SC.SectionDropdownIntegration
                            key={index}
                            active={sectionName === integration.id}
                            href={getRedirectLink('/integration/' + integration.id)}
                          >
                            {integration.id}
                            <img src={check} alt="check" height="16" width="16" />
                          </SC.SectionDropdownIntegration>
                        ))}
                        <SC.Flex>
                          <SC.SectionDropdownTitle>Connectors</SC.SectionDropdownTitle>
                          <SC.SectionDropdownSeeMore href={getRedirectLink('/connectors')}>
                            See all
                            <img src={rightArrow} alt="See all" height="8" width="8" />
                          </SC.SectionDropdownSeeMore>
                        </SC.Flex>
                        {connectors?.data?.items?.map((connector, index) => (
                          <SC.SectionDropdownIntegration
                            key={index}
                            active={sectionName === connector.id}
                            href={getRedirectLink('/connector/' + connector.id)}
                          >
                            {connector.id}
                            <img src={check} alt="check" height="16" width="16" />
                          </SC.SectionDropdownIntegration>
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
                          <SC.SectionDropdownTitle>Accounts</SC.SectionDropdownTitle>
                          <SC.SectionDropdownSeeMore href={getRedirectLink('/authentication')}>
                            See all
                            <img src={rightArrow} alt="See all" height="8" width="8" />
                          </SC.SectionDropdownSeeMore>
                        </SC.Flex>
                        <SC.SectionDropdownIntegration
                          active={true}
                          href={
                            '/account/' +
                            userData.accountId +
                            '/subscription/' +
                            userData.subscriptionId +
                            '/authentication/detail'
                          }
                        >
                          {userData.primaryEmail}
                          <img src={check} alt="check" height="16" width="16" />
                        </SC.SectionDropdownIntegration>
                      </SC.SectionDropdownMenu>
                    </Menu>
                    <Drawer anchor={'bottom'} open={drawerBottomOpen} onClose={() => setDrawerBottomOpen(false)}>
                      <SC.SectionDropdownMenu>
                        <SC.Flex>
                          <SC.SectionDropdownTitle>Accounts</SC.SectionDropdownTitle>
                          <SC.SectionDropdownSeeMore href={getRedirectLink('/authentication')}>
                            See all
                            <img src={rightArrow} alt="See all" height="8" width="8" />
                          </SC.SectionDropdownSeeMore>
                        </SC.Flex>
                        <SC.SectionDropdownIntegration
                          active={true}
                          href={
                            '/account/' +
                            userData.accountId +
                            '/subscription/' +
                            userData.subscriptionId +
                            '/authentication/detail'
                          }
                        >
                          {userData.primaryEmail}
                          <img src={check} alt="check" height="16" width="16" />
                        </SC.SectionDropdownIntegration>
                      </SC.SectionDropdownMenu>
                    </Drawer>
                  </SC.MenuWrapper>
                )}
              </>
            ) : (
              <SC.SectionLink
                href={
                  integration
                    ? getRedirectLink('/integrations')
                    : authentication
                    ? getRedirectLink('/authentication')
                    : getRedirectLink('/connectors')
                }
              >
                {sectionName}
              </SC.SectionLink>
            )}
          </SC.FlexDown>
          <SC.LinksContainer>
            <SC.Link href="/support">Support</SC.Link>
            <SC.Link href="/docs">Docs</SC.Link>
          </SC.LinksContainer>
          <SC.ButtonWrapper active={Boolean(anchorUserDropdown) && !loggingOut}>
            <Button
              style={{ backgroundColor: Boolean(anchorUserDropdown) && !loggingOut ? '#D7E5FF66' : '' }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(event: any) => setAnchorUserDropdown(event.currentTarget)}
              size="large"
              startIcon={<SC.User src={userData.picture || client} />}
              endIcon={Boolean(anchorUserDropdown) && !loggingOut ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              variant="text"
              color="inherit"
            >
              Stage
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
                <SC.UserDropdownInfo>
                  <SC.UserDropdownInfoImage src={userData.picture || client} alt="user" height="38" width="38" />
                  <SC.UserDropdownPersonalInfo>
                    <SC.UserDropdownInfoName>
                      {userData.firstName} {userData.lastName}
                    </SC.UserDropdownInfoName>
                    <SC.UserDropdownInfoEmail>{userData.primaryEmail}</SC.UserDropdownInfoEmail>
                  </SC.UserDropdownPersonalInfo>
                </SC.UserDropdownInfo>
                <SC.UserDropdownStatus href={getRedirectLink('/integrations')}>
                  <div>
                    <SC.UserDropdownStatusTitle>Stage</SC.UserDropdownStatusTitle>
                    <SC.UserDropdownStatusId>{userData.subscriptionId}</SC.UserDropdownStatusId>
                  </div>
                  <SC.UserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
                </SC.UserDropdownStatus>
                <SC.UserDropdownLinksWrapper>
                  <SC.UserDropdownLink href={getRedirectLink('/authentication')}>Authentication</SC.UserDropdownLink>
                  <SC.UserDropdownLink href="/billing">Billing</SC.UserDropdownLink>
                  <SC.UserDropdownLink href="/settings">Settings</SC.UserDropdownLink>
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
          <Drawer anchor={'right'} open={drawerOpen && !loggingOut} onClose={() => setDrawerOpen(false)}>
            <SC.DrawerWrapper>
              <SC.Flex>
                <SC.CompanyName>{userData.company}</SC.CompanyName>
                <SC.Cross onClick={() => setDrawerOpen(false)} src={cross} alt="close" height="10" width="10" />
              </SC.Flex>

              <SC.UserDropdownInfo>
                <SC.UserDropdownInfoImage src={userData.picture || client} alt="user" height="38" width="38" />
                <SC.UserDropdownPersonalInfo>
                  <SC.UserDropdownInfoName>
                    {userData.firstName} {userData.lastName}
                  </SC.UserDropdownInfoName>
                  <SC.UserDropdownInfoEmail>{userData.primaryEmail}</SC.UserDropdownInfoEmail>
                </SC.UserDropdownPersonalInfo>
              </SC.UserDropdownInfo>

              <SC.UserDropdownStatus href={getRedirectLink('/integrations')}>
                <div>
                  <SC.UserDropdownStatusTitle>Stage</SC.UserDropdownStatusTitle>
                  <SC.UserDropdownStatusId>{userData.subscriptionId}</SC.UserDropdownStatusId>
                </div>
                <SC.UserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
              </SC.UserDropdownStatus>
              <SC.UserDropdownLinksWrapper>
                <SC.UserDropdownLink href={getRedirectLink('/authentication')}>Authentication</SC.UserDropdownLink>
                <SC.UserDropdownLink href="/billing">Billing</SC.UserDropdownLink>
                <SC.UserDropdownLink href="/settings">Settings</SC.UserDropdownLink>
              </SC.UserDropdownLinksWrapper>

              <SC.Br />

              <SC.UserDropdownLinksWrapper>
                <SC.UserDropdownLink href="/support">Support</SC.UserDropdownLink>
                <SC.UserDropdownLink href="/docs">Docs</SC.UserDropdownLink>
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
