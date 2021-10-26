import { Box, Icon, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Close } from '../../globalStyle';

const StyledContainer = styled(Box)`
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

interface Props {
  className?: string;
  icon?: React.ReactElement;
  onDelete?: () => void;
  name?: string;
  id?: string;
  onClick?: () => void;
}

const StyledCloseButton = styled(Close)`
  position: static;
`;

const ListItem: React.FC<Props> = ({ name, icon, className, onDelete, onClick, id, ...props }) => {
  return (
    <StyledContainer
      id={id}
      display="flex"
      p="17px"
      borderRadius="4px"
      bgcolor="rgba(215, 229, 255, 0.4)"
      alignItems="center"
      maxHeight="52px"
      boxSizing="border-box"
      className={className}
      component="button"
      width="100%"
      border="none"
      onClick={onClick}
      {...props}
    >
      {icon && (
        <Box mr="17px">
          <Icon>{icon}</Icon>
        </Box>
      )}
      <Typography
        variant="body2"
        component="p"
        style={{
          fontWeight: 500,
          color: 'var(--black)',
        }}
      >
        {name}
      </Typography>
      {onDelete && (
        <Box ml="auto">
          <StyledCloseButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </Box>
      )}
    </StyledContainer>
  );
};

export default ListItem;
