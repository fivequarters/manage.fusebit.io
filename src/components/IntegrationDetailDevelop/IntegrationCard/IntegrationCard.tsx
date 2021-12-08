import fusebitLogo from '@assets/fusebit-logo.svg';
import Button from '@components/common/Button/Button';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { useLoader } from '@hooks/useLoader';
import { useError } from '@hooks/useError';
import { Box, Card, CardActions, CardContent, CircularProgress, Typography } from '@material-ui/core';
import { INTEGRATION_PROCESSING_SUFFIX } from '@utils/constants';
import React, { useEffect } from 'react';
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
  processing: boolean;
  setProcessing: (newValue: boolean) => void;
  className?: string;
}

export const INTEGRATION_CARD_ID = 'integration-card';

const IntegrationCard: React.FC<Props> = ({ processing, setProcessing, className }) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const integrationData = useGetIntegrationFromCache();
  const { waitForEntityStateChange } = useLoader();
  const { createError } = useError();
  const processingKey = `${integrationData?.data.id}${INTEGRATION_PROCESSING_SUFFIX}`;

  useEffect(() => {
    if (integrationData?.data.id) {
      const pendingProcessing = localStorage.getItem(processingKey);
      if (pendingProcessing) {
        setProcessing(true);
        const dataToProcess = [{ entityType: 'integration', entityId: integrationData.data.id }];
        integrationData.data.data.components.forEach((component) => {
          const newComponentToProcess = {
            entityType: component.entityType,
            entityId: component.entityId,
          };
          dataToProcess.push(newComponentToProcess);
        });
        Promise.all(dataToProcess.map(({ entityType, entityId }) => waitForEntityStateChange(entityType, [entityId])))
          .then(() => {
            localStorage.removeItem(processingKey);
            setProcessing(false);
          })
          .catch((e) => {
            createError(e);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationData]);

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
              }}
            >
              {integrationData?.data.id || id}
            </Typography>
          </Box>
        </StyledContent>
        <StyledActions>
          <Button
            onClick={() => history.push('edit')}
            style={{ width: '200px' }}
            variant="contained"
            color="primary"
            disabled={processing}
          >
            <>
              {processing && <CircularProgress color="inherit" size={20} style={{ marginRight: '10px' }} />}
              Edit
            </>
          </Button>
        </StyledActions>
      </StyledCard>
    </>
  );
};

export default IntegrationCard;
