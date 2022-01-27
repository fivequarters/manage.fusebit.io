import Card from '@components/common/Card';
import { StyledListItem } from '@components/globalStyle';
import { Box } from '@material-ui/core';
import { trackEvent } from '@utils/analytics';
import { sendIntercomMessage } from '@utils/intercom';

const Reliability = () => {
  const handleIntercomPost = () => {
    trackEvent('Talk to Sales Clicked', 'Reliability');
    window.Intercom?.('showNewMessage', 'I would like to enable the "Reliability" feature for my account.');
    sendIntercomMessage();
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="108px">
      <Card
        title="Guarantee **reliable delivery** of integration data"
        description="Reliability, for your customers, means they can trust your integrations to run correctly without the potential for data loss or unexpected delays."
        buttonText="Talk to sales"
        handleClick={handleIntercomPost}
      >
        <ul>
          <StyledListItem>
            Automatic outbound throttling and retries when third-party APIs traffic volume gets too high
          </StyledListItem>
          <StyledListItem>
            Inbound traffic throttling to ensure your infrastructure capacity is not exceeded by third-party webhooks
            and events
          </StyledListItem>
          <StyledListItem>
            Clear visibility into failures and manual retry ability when automatic heuristics don’t make sense
          </StyledListItem>
        </ul>
      </Card>
    </Box>
  );
};

export default Reliability;
