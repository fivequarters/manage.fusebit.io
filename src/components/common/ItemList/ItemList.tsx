import React from 'react';
import { List, ListItem, ListItemText, Box } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';

const StyledIconContainer = styled(Box)`
  & * {
    width: 18px;
  }
`;

interface Item {
  text?: string;
  id: string;
  hideArrow?: boolean;
  icon?: any;
  onClick?: () => void;
}

interface Props {
  items?: Item[];
  activeItem?: string;
}

const ItemList: React.FC<Props> = ({ items = [], activeItem }) => {
  return (
    <List component="nav" aria-label="main mailbox folders">
      {items.map((item) => (
        <ListItem button key={item.id} onClick={() => item.onClick?.()} selected={item?.id === activeItem}>
          {item.icon && (
            <StyledIconContainer mr="16px" width="18px" height="18px">
              {item.icon}
            </StyledIconContainer>
          )}
          <ListItemText primary={item.text} />
          {!item.hideArrow && <ArrowForwardIosIcon style={{ width: 14 }} />}
        </ListItem>
      ))}
    </List>
  );
};

export default ItemList;
