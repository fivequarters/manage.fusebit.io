import React from 'react';
import { Card as MUICard, CardContent, CardActions, Typography, Box } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Button from '../Button';

const StyledCard = styled(MUICard)`
  width: fit-content;
  max-width: 474px;
  box-shadow: 0px 20px 48px 0px #34487b1a;
  border-radius: 8px;
  padding: 28px 48px 56px;
`;

const StyledTitle = styled(ReactMarkdown)`
  padding: 0;
  h2 {
    font-size: 24px;
    line-height: 26px;
    font-weight: 600;
    color: var(--black);
  }

  strong {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const StyledDescription = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  margin-bottom: 32px;
  color: var(--black);
`;

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  buttonText?: string;
  handleClick?: () => void;
}

const Card: React.FC<Props> = ({ title, description, buttonText, handleClick, children }) => {
  return (
    <StyledCard>
      <CardContent>
        {title && <StyledTitle>{title}</StyledTitle>}
        {description && <StyledDescription>{description}</StyledDescription>}
        {children}
      </CardContent>
      <CardActions>
        <Box margin="0 auto">
          <Button
            onClick={() => handleClick?.()}
            size="large"
            variant="contained"
            style={{ width: '200px', height: '48px' }}
          >
            {buttonText || 'Accept'}
          </Button>
        </Box>
      </CardActions>
    </StyledCard>
  );
};

export default Card;
