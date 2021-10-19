import { Box, BoxProps, IconButton } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';

const StyledContainer = styled(Box)`
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

interface Props extends BoxProps {
  className?: string;
}

const ListItem: React.FC<Props> = ({ children, className, ...props }) => {
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
      {children}
      <Box ml="auto">
        <IconButton size="small">
          <CloseIcon fontSize="small" htmlColor="black" />
        </IconButton>
      </Box>
    </StyledContainer>
  );
};

export default ListItem;
