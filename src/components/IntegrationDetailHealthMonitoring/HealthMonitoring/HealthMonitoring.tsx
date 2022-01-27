import Card from '@components/common/Card';
import { StyledListItem } from '@components/globalStyle';
import { Box } from '@material-ui/core';
import { trackEvent } from '@utils/analytics';
import { sendIntercomMessage } from '@utils/intercom';

const HealthMonitoring = () => {
  const handleIntercomPost = () => {
    trackEvent('Talk to Sales Clicked', 'Health');
    window.Intercom?.('showNewMessage', 'I would like to enable the "Health" feature for my account.');
    sendIntercomMessage();
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="108px">
      <Card
        title="**Don’t spend time** worrying about infrastructure"
        description="Health enables your team to spend more time on the core business while Fusebit ensures your integrations are running and healthy."
        buttonText="Talk to sales"
        handleClick={handleIntercomPost}
      >
        <ul>
          <StyledListItem>Automated health checks ensure integrations stay up with minimal upkeep</StyledListItem>
          <StyledListItem>
            Self-service end-user recovery in common situations such as expired credentials
          </StyledListItem>
          <StyledListItem>Alerting integration with your infrastructure of choice</StyledListItem>
        </ul>
      </Card>
    </Box>
  );
};

export default HealthMonitoring;
