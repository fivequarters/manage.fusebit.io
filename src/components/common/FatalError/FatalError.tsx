import React from 'react';
import styled, { css } from 'styled-components';
import warning from '@assets/warning-red.svg';
import { FallbackProps } from 'react-error-boundary';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useTitle from '@hooks/useTitle';
import { useHistory } from 'react-router-dom';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import Navbar from '@components/common/Navbar';
import Layout from '@components/common/Layout';
import NavbarBreadcrumb from '@components/common/NavbarBreadcrumb';
import { Box } from '@mui/material';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

const StyledWarning = styled.img`
  height: 40px;
  width: 40px;
  object-fit: contain;
  margin-top: 80px;
`;

const StyledTitle = styled.h1`
  font-size: 56px;
  line-height: 58px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 32px;

  @media only screen and (max-width: 500px) {
    font-size: 40px;
    line-height: 50px;
  }
`;

const StyledDescription = styled.p`
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  max-width: 578px;
  margin-bottom: 20px;

  @media only screen and (max-width: 500px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

const StyledHr = styled.div`
  width: 65.5px;
  height: 2px;
  background-color: var(--primary-color);
  margin-bottom: 20px;
`;

const StyledIconButton = styled(IconButton)<{ $expanded: boolean }>`
  transition: transform 0.3s ease-in-out;

  ${(props) =>
    props.$expanded &&
    css`
      transform: rotate(180deg);
      margin-left: auto;
    `}
`;

const FatalError: React.FC<FallbackProps> = ({ error }) => {
  useTitle('Fatal Error');
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Layout>
      <Navbar>
        <NavbarBreadcrumb
          lastItemAction={false}
          items={[
            {
              text: 'Integrations',
              onClick: () => history.push(getRedirectLink('/integrations/overview')),
            },
          ]}
        />
      </Navbar>
      <StyledWrapper>
        <StyledWarning src={warning} alt="warning" height="40" width="40" />
        <StyledTitle>Error</StyledTitle>
        <StyledDescription>
          {error.name}: {error.message}
        </StyledDescription>
        <StyledDescription>
          {expanded ? 'Hide' : 'See'} Stack Trace
          <StyledIconButton $expanded={expanded} onClick={handleExpandClick}>
            <ExpandMoreIcon />
          </StyledIconButton>
        </StyledDescription>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            maxWidth={600}
            padding={5}
            borderRadius="8px"
            style={{ wordWrap: 'break-word', backgroundColor: 'var(--secondary-color)' }}
          >
            {error.stack}
          </Box>
        </Collapse>
        <StyledHr />
      </StyledWrapper>
    </Layout>
  );
};

export default FatalError;
