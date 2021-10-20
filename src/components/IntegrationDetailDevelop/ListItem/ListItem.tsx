import { Box, Icon, IconButton, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';

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
}

const ListItem: React.FC<Props> = ({ name, icon, className, onDelete, ...props }) => {
  return (
    <StyledContainer
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
        }}
      >
        {name}
      </Typography>
      {onDelete && (
        <Box ml="auto">
          <IconButton size="small" onClick={onDelete}>
            <CloseIcon fontSize="small" htmlColor="black" />
          </IconButton>
        </Box>
      )}
    </StyledContainer>
  );
};

export default ListItem;
