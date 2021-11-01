import { Box, Icon, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Close } from '@components/globalStyle';

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

const StyledCloseContainer = styled(Box)`
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 450px) {
    & > button {
      height: 8px;
      width: 8px;
    }
  }
`;

const ListItem: React.FC<Props> = ({ name, icon, className, onDelete, onClick, id, ...props }) => {
  return (
    <StyledContainer
      id={id}
      display="flex"
      p="11px"
      borderRadius="4px"
      bgcolor="rgba(215, 229, 255, 0.4)"
      alignItems="center"
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
          textAlign: 'left',
        }}
      >
        {name}
      </Typography>
      {onDelete && (
        <StyledCloseContainer ml="auto">
          <StyledCloseButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </StyledCloseContainer>
      )}
    </StyledContainer>
  );
};

export default ListItem;
