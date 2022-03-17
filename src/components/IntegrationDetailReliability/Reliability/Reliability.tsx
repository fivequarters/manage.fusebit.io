import Card from '@components/common/Card';
import { StyledListItem } from '@components/globalStyle';
import { Box, useMediaQuery } from '@material-ui/core';
import { trackEventMemoized } from '@utils/analytics';
import { sendIntercomMessage } from '@utils/intercom';
import { useParams } from 'react-router-dom';
import reliability from '@assets/reliability.png';
import BackgroundImage from '@components/common/BackgroundImage';
import { css } from 'styled-components';

const Reliability = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useMediaQuery('(max-width: 880px)');

  const handleIntercomPost = () => {
    trackEventMemoized('Talk to Sales Button Clicked', 'Reliability', { integration: id });
    window.Intercom?.('showNewMessage', 'I would like to enable the "Reliability" feature for my account.');
    sendIntercomMessage();
  };

  const imageStyles = css`
    background-size: contain;
  `;

  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="40px" position="relative">
      {!isMobile && <BackgroundImage image={reliability} css={imageStyles} />}
      <Card
        title="Guarantee **reliable delivery** of integration data"
        description="Your customers can trust your integrations to run correctly without data loss or unexpected delays - even when the remote service misbehaves."
        buttonText="Talk to sales"
        handleClick={handleIntercomPost}
      >
        <ul>
          <StyledListItem>Automatic outbound throttling and retries for third-party APIs</StyledListItem>
          <StyledListItem>
            Inbound traffic throttling ensures your infrastructure capacity is not exceeded by third-party webhooks and
            events
          </StyledListItem>
          <StyledListItem>
            Clear visibility into failures and manual test when automatic heuristics don't make sense
          </StyledListItem>
        </ul>
      </Card>
    </Box>
  );
};

export default Reliability;
