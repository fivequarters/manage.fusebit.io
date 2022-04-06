import Modal from '@components/common/Modal';
import video from '@assets/demo-video.mp4';
import { Backdrop, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@hooks/useQuery';
import Video from '@components/common/Video';
import { trackEventMemoized } from '@utils/analytics';

const StyledTitle = styled.h2`
  font-size: 24px;
  line-height: 26px;
  color: var(--black);
  margin-bottom: 14px;
`;

const StyledDescription = styled.p`
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  margin-bottom: 24px;
  max-width: 720px;

  strong {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const StyledVideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 524px;
`;

const Onboarding: React.FC = () => {
  const [open, setOpen] = useState(false);
  const query = useQuery();
  const objectLocation = 'Onboarding Video';

  useEffect(() => {
    const utmContent = query.get('utm_content');
    if (utmContent === 'new-vid') {
      setOpen(true);
      trackEventMemoized('Product Video Modal Viewed', objectLocation);
      window.onbeforeunload = () => {
        // The message below is not gonna be showed, as browsers no longer support
        // custom messages on beforeUnload: https://developer.chrome.com/blog/chrome-51-deprecations/#remove_custom_messages_in_onbeforeunload_dialogs
        return 'You have not finished the video. Are you sure you wanna leave?';
      };
    }
  }, [query]);

  const onPlay = () => {
    trackEventMemoized('Product Video Played', objectLocation);
  };

  const onEnded = () => {
    trackEventMemoized('Product Video Completed', objectLocation);
  };

  return (
    <Modal fullScreen disableActions disableClose open={open} closeAfterTransition BackdropComponent={Backdrop}>
      <Container maxWidth="lg">
        <StyledTitle>Almost Done!</StyledTitle>
        <StyledDescription>
          Now that you are signed up to Fusebit, let's get you ready to{' '}
          <strong>start building a code-first integration in minutes.</strong> Watch the demo below on a few key
          developer concepts.
        </StyledDescription>
        <StyledVideoWrapper>
          <Video
            onPlay={onPlay}
            onEnded={onEnded}
            src={video}
            tracks={[{ src: 'captions_en.vtt', kind: 'captions', srcLang: 'en', label: 'english_captions' }]}
          />
        </StyledVideoWrapper>
      </Container>
    </Modal>
  );
};
export default Onboarding;
