import fusebitLogo from '@assets/fusebit-logo.svg';
import Button from '@components/common/Button/Button';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { Box, Card, CardActions, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 260px;
  width: 285px;
  margin: 0 auto;
  border: 2px solid #f83420;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  border-radius: 8px;
`;

const StyledContent = styled(CardContent)`
  padding: 32px 32px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledActions = styled(CardActions)`
  padding: 0 32px 32px;
  margin: auto;
`;

interface Props {
  className?: string;
}

export const INTEGRATION_CARD_ID = 'integration-card';

const IntegrationCard: React.FC<Props> = ({ className }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const integrationData = useGetIntegrationFromCache();

  const handleClick = () => {
    gtag('event', 'click', {
      event_category: 'Integration Detail',
      event_label: 'Edit Button Clicked',
    });

    history.push('edit');
  };

  return (
    <>
      <StyledCard id={INTEGRATION_CARD_ID} className={className}>
        <StyledContent>
          <Box display="flex" mb="14px" justifyContent="center">
            <img src={fusebitLogo} alt="fusebit" width={109} height={28} />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
            <Typography
              variant="h3"
              style={{
                fontWeight: 600,
                fontSize: 20,
                textAlign: 'center',
              }}
            >
              {integrationData?.data.id || id}
            </Typography>
          </Box>
        </StyledContent>
        <StyledActions>
          <Button onClick={handleClick} style={{ width: '200px' }} variant="contained" color="primary">
            <>Edit</>
          </Button>
        </StyledActions>
      </StyledCard>
    </>
  );
};

export default IntegrationCard;
