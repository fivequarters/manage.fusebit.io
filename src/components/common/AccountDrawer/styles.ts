import styled from 'styled-components';
import { Button, Drawer } from '@material-ui/core';

export const DrawerComponent = styled(Drawer)`
  > div {
    position: relative;
    padding: 104px 32px 104px 0;
    min-height: calc(100vh - var(--navbar-height));
    border-right: none;
    box-shadow: 25px 1px 30px -1px rgba(52, 72, 123, 0.05);
    margin-right: 93px;
  }
`;

export const Link = styled(Button)<{ active?: boolean }>`
  font-size: 16px;
  line-height: 18px;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  background-color: ${(props) => props.active && 'var(--secondary-color)'};
  box-shadow: none;
  width: 254px;
  justify-content: left;
  padding: 11px 16px;
  transition: font-weight 0.1s linear;
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &:hover {
    background-color: var(--secondary-color);
    font-weight: 600;
  }
`;
