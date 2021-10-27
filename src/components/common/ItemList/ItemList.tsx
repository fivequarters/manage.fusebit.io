import React from 'react';
import { List, ListItem, ListItemText, Box } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';

const StyledIconContainer = styled(Box)`
  & * {
    width: 18px;
  }
`;

interface Props {
  items?: {
    text: string;
    showArrow?: boolean;
    icon?: any;
  }[];
}

const ItemList: React.FC<Props> = ({ items = [] }) => {
  return (
    <List component="nav" aria-label="main mailbox folders">
      {items.map((item) => (
        <ListItem button key={item.text}>
          {item.icon && (
            <StyledIconContainer mr="16px" width="18px" height="18px">
              {item.icon}
            </StyledIconContainer>
          )}
          <ListItemText primary={item.text} />
          {item.showArrow && <ArrowForwardIosIcon style={{ width: 14 }} />}
        </ListItem>
      ))}
    </List>
  );
};

export default ItemList;
