import Card from '@components/common/Card';
import { StyledListItem } from '@components/globalStyle';
import { Box, useMediaQuery } from '@material-ui/core';
import { trackEventMemoized } from '@utils/analytics';
import { useParams } from 'react-router-dom';
import health from '@assets/health.png';
import BackgroundImage from '@components/common/BackgroundImage/BackgroundImage';
import { useQuery } from '@hooks/useQuery';
import { useEffect, useState } from 'react';
import GrafanaHealth from '@components/common/GrafanaHealth';

const ENABLE_HEALTH_DASHBOARD = 'enableHealthDashboard';

const HealthMonitoring = () => {
  const { id } = useParams<{ id: string }>();
  const query = useQuery();
  const isMobile = useMediaQuery('(max-width: 880px)');
  const [enableHealthDashboard, setEnableHealthDashboard] = useState(false);

  useEffect(() => {
    const isHealthDashboardEnabled =
      (query.get(ENABLE_HEALTH_DASHBOARD) === 'true' || localStorage.getItem(ENABLE_HEALTH_DASHBOARD) === 'true') &&
      query.get(ENABLE_HEALTH_DASHBOARD) !== 'false';

    if (isHealthDashboardEnabled) {
      setEnableHealthDashboard(true);
      localStorage.setItem(ENABLE_HEALTH_DASHBOARD, 'true');
    } else {
      setEnableHealthDashboard(false);
      localStorage.removeItem(ENABLE_HEALTH_DASHBOARD);
    }
  }, [query]);

  const handleIntercomPost = () => {
    trackEventMemoized('Talk to Sales Button Clicked', 'Health', { integration: id });
    window.Intercom?.('showNewMessage', 'I would like to enable the "Health" feature for my account.');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={!enableHealthDashboard ? '100%' : '170vh'}
      pb="140px"
      position="relative"
    >
      {!enableHealthDashboard ? (
        <>
          {!isMobile && <BackgroundImage image={health} />}
          <Card
            title="**Don’t spend time** worrying about infrastructure"
            description="Your team spends more time on the core business while Fusebit ensures your integrations are running and healthy."
            buttonText="Talk to sales"
            handleClick={handleIntercomPost}
          >
            <ul>
              <StyledListItem>Automated health checks ensure integrations stay up</StyledListItem>
              <StyledListItem>
                Self-service end-user recovery for common situations such as expired credentials
              </StyledListItem>
              <StyledListItem>Alerting integration with your existing operational infrastructure</StyledListItem>
            </ul>
          </Card>
        </>
      ) : (
        <GrafanaHealth />
      )}
    </Box>
  );
};

export default HealthMonitoring;
