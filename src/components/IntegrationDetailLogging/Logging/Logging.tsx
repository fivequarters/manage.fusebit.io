import BackgroundImage from '@components/common/BackgroundImage';
import Card from '@components/common/Card';
import { StyledListItem } from '@components/globalStyle';
import { Box, useMediaQuery } from '@material-ui/core';
import { trackEvent } from '@utils/analytics';
import { sendIntercomMessage } from '@utils/intercom';
import { useParams } from 'react-router-dom';
import logging from '@assets/logging.png';

const Logging = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useMediaQuery('(max-width: 880px)');

  const handleIntercomPost = () => {
    trackEvent('Talk to Sales Button Clicked', 'Logging', { integration: id });
    window.Intercom?.('showNewMessage', 'I would like to enable the "Logging" feature for my account.');
    sendIntercomMessage();
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="140px" position="relative">
      {!isMobile && <BackgroundImage image={logging} />}
      <Card
        title="See it all **in one place**"
        description="Logging allows you to spend less time searching and more time analyzing how to resolve incidents or performance issues."
        buttonText="Talk to sales"
        handleClick={handleIntercomPost}
      >
        <ul>
          <StyledListItem>Centralized logs for all executions of your integration</StyledListItem>
          <StyledListItem>
            Trace requests end-to-end from your system all the way to third-party APIs and webhooks
          </StyledListItem>
          <StyledListItem>Quickly search, filter, and analyze your logs for debugging</StyledListItem>
        </ul>
      </Card>
    </Box>
  );
};

export default Logging;
