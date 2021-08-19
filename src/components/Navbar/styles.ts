import styled from 'styled-components';
import navbarBg from '../../assets/navbar.svg';
import user from '../../assets/company-logo.svg';
import arrow from '../../assets/right-arrow-white.svg';

export const Background = styled.div`
  width: 100vw;
  height: 185px;
  display: flex;
  background-image: url(${navbarBg});
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 50px;

  @media only screen and (max-width: 880px) {
    height: 164px;
    padding-top: 41px;
  }
`;

export const Nav = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const FlexDown = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CompanyImg = styled.span`
  height: 56px;
  width: 56px;
  background-size: contain;
  background-image: url(${user});
  background-repeat: no-repeat;
  margin-right: 24px;

  @media only screen and (max-width: 880px) {
    height: 40px;
    width: 40px;
    margin-right: 16px;
  }
`;

export const CompanyName = styled.span`
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
    width: 100px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const Arrow = styled.div`
  height: 14px;
  width: 14px;
  margin-right: 16px;
  margin-bottom: -10px;
  background-size: contain;
  background-image: url(${arrow});
  background-repeat: no-repeat;
`;

export const SectionDropdown = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;

  &:hover  {
    cursor: pointer;
  }

  & > img {
    margin-bottom: -10px;
    transform: ${(props) => props.active && 'rotate(180deg)'};
    transition: all 0.25s linear;
  }

  @media only screen and (max-width: 880px) {
    display: none;
  }
`;

export const SectionDropdownMobile = styled.div<{ active: boolean }>`
  display: none;
  align-items: center;

  &:hover  {
    cursor: pointer;
  }

  & > img {
    margin-bottom: -10px;
    transform: ${(props) => props.active && 'rotate(180deg)'};
    transition: all 0.25s linear;
  }

  @media only screen and (max-width: 880px) {
    display: flex;
  }
`;

export const SectionDropdownMenu = styled.div`
  padding: 0px 32px 12px;
  width: 317px;

  @media only screen and (max-width: 880px) {
    width: 100%;
    padding: 24px;
  }
`;

export const SectionDropdownTitle = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-right: auto;
  margin-bottom: 16px;
`;

export const SectionDropdownSeeMore = styled.span`
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  text-decoration: none;
  margin-bottom: -4px;
  margin-left: auto;
  color: var(--black);

  & > img {
    margin-left: 9px;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const SectionDropdownIntegration = styled.span<{ active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? 'var(--secondary-color)' : 'white')};
  font-size: 14px;
  line-height: 16px;
  font-weight: ${(props) => (props.active ? 700 : 400)};
  text-decoration: none;
  color: var(--black);
  margin-bottom: 5px;
  transition: all 0.25s linear;

  &:hover {
    background-color: var(--secondary-color);
    cursor: pointer;
  }

  & > img {
    margin-left: auto;
    display: ${(props) => (props.active ? 'block' : 'none')};
  }
`;

export const UserDropdown = styled.div`
  padding: 0px 32px 24px;
`;

export const UserDropdownCompany = styled.h5`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--primary-color);
  text-transform: uppercase;
  margin-bottom: 24px;
`;

export const UserDropdownInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;

  @media only screen and (max-width: 880px) {
    margin-top: 48px;
  }
`;

export const UserDropdownInfoImage = styled.img`
  height: 38px;
  width: 38px;
  object-fit: contain;
  border-radius: 50%;
  margin-right: 16px;
`;

export const UserDropdownPersonalInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserDropdownInfoName = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
  margin-top: auto;
`;

export const UserDropdownInfoEmail = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  margin-bottom: auto;
`;

export const UserDropdownStatus = styled.span`
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

export const UserDropdownStatusTitle = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 8px;
`;

export const UserDropdownStatusId = styled.div`
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

export const UserDropdownStatusArrow = styled.img`
  height: 12px;
  width: 12px;
  object-fit: contain;
  margin-left: auto;
`;

export const UserDropdownLinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const UserDropdownLink = styled.span<{ noMargin?: boolean }>`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: none;
  width: max-content;
  transition: all 0.25s linear;
  ${(props) => (props.noMargin ? '' : 'margin-bottom: 16px;')}

  &:hover {
    color: var(--primary-color);
  }
`;

export const UserDropdownLinkA = styled.a`
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: none;
  width: max-content;
  transition: all 0.25s linear;

  &:not(:last-child) {
    margin-bottom: 16px;
  }

  &:hover {
    color: var(--primary-color);
  }
`;

export const UserButtonWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const UserButtonMargin = styled.div`
  margin-left: auto;
`;

export const Flex = styled.div<{ mobileHidden?: boolean }>`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 880px) {
    display: ${(props) => props.mobileHidden && 'none'};
  }
`;

export const SectionLink = styled.span`
  font-size: 20px;
  line-height: 22px;
  font-weight: 300;
  width: max-content;
  text-decoration: none;
  margin-right: 10px;
  margin: 8px 10px 0 0;
  color: white;
`;

export const SectionName = styled.h3`
  font-size: 20px;
  line-height: 22px;
  font-weight: 600;
  margin-right: 10px;
  margin: 8px 10px 0 0;
  color: white;
`;

export const LinksContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

export const Link = styled.span`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  text-decoration: none;
  color: white;
  margin-right: 72px;

  @media only screen and (max-width: 880px) {
    display: none;
  }
`;

export const LinkA = styled.a`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  text-decoration: none;
  color: white;
  margin-right: 72px;

  @media only screen and (max-width: 880px) {
    display: none;
  }
`;

export const ButtonWrapper = styled.div<{ active: boolean }>`
  color: white;
  border: 1px solid ${(props) => (props.active ? 'rgba(215, 229, 255, 0)' : '#D7E5FF66')};
  border-radius: 4px;
  transition: all 0.25s linear;

  @media only screen and (max-width: 880px) {
    display: none;
  }
`;

export const User = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  object-fit: contain;
`;

export const Menu = styled.img`
  display: none;
  height: 10px;
  width: 20px;
  object-fit: contain;
  background-repeat: no-repeat;
  margin-left: auto;

  @media only screen and (max-width: 880px) {
    display: block;
  }
`;

export const Cross = styled.img`
  height: 10px;
  width: 10px;
  object-fit: contain;
  background-repeat: no-repeat;
  margin-left: auto;
`;

export const DrawerWrapper = styled.div`
  position: relative;
  padding: 50px 24px 50px 32px;
  border-radius: 8px 0 0 8px;
`;

export const Br = styled.div`
  height: 1px;
  width: 152px;
  background-color: #959595;
  margin: 32px 0;
`;

// TODO: Remove me
export const FloatingLogin = styled.span`
  position: fixed;
  bottom: 0;
  right: 20px;
  background: #ef3221;
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  text-decoration: none;
`;

// TODO: Remove me
export const FloatingInput = styled.input`
  position: fixed;
  bottom: 0;
  left: 20px;
  border: 1px solid #ccc;
  border-bottom: 0;
  background: white;
  font-weight: bold;
  padding: 5px 10px;
  text-decoration: none;
`;

export const MenuWrapper = styled.div`
  @media only screen and (max-width: 880px) {
    display: none;
  }
`;
