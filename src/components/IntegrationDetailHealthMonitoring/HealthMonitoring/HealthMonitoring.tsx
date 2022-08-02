import Card from '@components/common/Card';
import { StyledListItem } from '@components/globalStyle';
import { Box, useMediaQuery } from '@material-ui/core';
import { trackEventMemoized } from '@utils/analytics';
import { useParams } from 'react-router-dom';
import health from '@assets/health.png';
import BackgroundImage from '@components/common/BackgroundImage/BackgroundImage';
import { useQuery } from '@hooks/useQuery';
import { useEffect, useState } from 'react';
import * as CSC from '@components/globalStyle';

const HealthMonitoring = () => {
  const { id } = useParams<{ id: string }>();
  const query = useQuery();
  const isMobile = useMediaQuery('(max-width: 880px)');
  const [enableHealthDashboard, setEnableHealthDashboard] = useState(false);

  useEffect(() => {
    const isHealthDashboardEnabled =
      (query.get('enableHealthDashboard') === 'true' || localStorage.getItem('enableHealthDashboard') === 'true') &&
      query.get('enableHealthDashboard') !== 'false';

    if (isHealthDashboardEnabled) {
      setEnableHealthDashboard(true);
      localStorage.setItem('enableHealthDashboard', 'true');
    } else {
      setEnableHealthDashboard(false);
      localStorage.removeItem('enableHealthDashboard');
    }
  }, [query]);

  const handleIntercomPost = () => {
    trackEventMemoized('Talk to Sales Button Clicked', 'Health', { integration: id });
    window.Intercom?.('showNewMessage', 'I would like to enable the "Health" feature for my account.');
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="140px" position="relative">
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
        <CSC.StyledLogs
          id="health-monitoring"
          title="health-monitoring"
          src="https://stage.us-west-2.fusebit.io/v2/grafana/d/WmVWQ-R4z/health-monitoring?orgId=36&kiosk&theme=fusebit"
          height="100%"
          width="100%"
          frameBorder="0"
        />
      )}
    </Box>
  );
};

export default HealthMonitoring;
