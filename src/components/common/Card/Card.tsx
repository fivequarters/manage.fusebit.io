import React from 'react';
import { Card as MUICard, CardContent, CardActions, Typography, Box, useMediaQuery } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Button from '../Button';

const StyledCard = styled(MUICard)`
  width: fit-content;
  max-width: 644px;
  box-shadow: 0px 20px 48px 0px #34487b1a;
  border-radius: 8px;
  padding: 28px 48px 56px;

  @media only screen and (max-width: 510px) {
    padding: 0 16px 28px;
  }
`;

const StyledTitle = styled(ReactMarkdown)`
  font-size: 24px;
  line-height: 26px;
  font-weight: 600;
  color: var(--black);

  @media only screen and (max-width: 510px) {
    font-size: 20px;
    line-height: 26px;
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

  @media only screen and (max-width: 510px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  buttonText?: string;
  handleClick?: () => void;
}

const Card: React.FC<Props> = ({ title, description, buttonText, handleClick, children }) => {
  const isMobile = useMediaQuery('(max-width: 510px)');
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
            size={isMobile ? 'medium' : 'large'}
            variant="contained"
            style={{ width: isMobile ? 'fit-content' : '200px', height: isMobile ? '32px' : '48px' }}
          >
            {buttonText || 'Accept'}
          </Button>
        </Box>
      </CardActions>
    </StyledCard>
  );
};

export default Card;
