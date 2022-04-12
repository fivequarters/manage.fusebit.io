import Modal from '@components/common/Modal';
import video from '@assets/placeholder-video.mp4';
import { Backdrop } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@hooks/useQuery';
import Video from '@components/common/Video';
import { trackEventMemoized } from '@utils/analytics';

const StyledTitle = styled.h2`
  font-size: 28px;
  line-height: 24px;
  color: var(--black);
  margin-top: 10px;
  margin-bottom: 16px;
`;

const StyledDescription = styled.p`
  font-size: 18px;
  line-height: 24px;
  max-width: 1050px;
  color: var(--black);
  margin-bottom: 24px;

  strong {
    color: var(--primary-color);
    font-weight: 600;
  }
`;

const StyledVideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
`;

enum UTM_CONTENT {
  NEW_VID = 'new-vid',
}

const Onboarding: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const query = useQuery();
  const objectLocation = 'Onboarding Video';

  useEffect(() => {
    const utmContent = query.get('utm_content');
    if (utmContent === UTM_CONTENT.NEW_VID && !videoCompleted) {
      setOpen(true);
      trackEventMemoized('Product Video Modal Viewed', objectLocation);
      window.onbeforeunload = () => {
        // The message below is not gonna be showed, as browsers no longer support
        // custom messages on beforeUnload: https://developer.chrome.com/blog/chrome-51-deprecations/#remove_custom_messages_in_onbeforeunload_dialogs
        return 'You have not finished the video. Are you sure you wanna leave?';
      };
    }
  }, [query, videoCompleted]);

  const onPlay = () => {
    trackEventMemoized('Product Video Played', objectLocation);
  };

  const onEnded = () => {
    trackEventMemoized('Product Video Completed', objectLocation);
    setVideoCompleted(true);
  };

  return (
    <Modal disableActions disableClose open={open} closeAfterTransition BackdropComponent={Backdrop}>
      <div>
        <StyledTitle>Welcome to Fusebit!</StyledTitle>
        <StyledDescription>
          Now that you are signed up to Fusebit, let's get you ready to{' '}
          <strong>start building a code-first integration in minutes.</strong> Watch the video below to learn key
          concepts
        </StyledDescription>
        <StyledVideoWrapper>
          <Video
            onPlay={onPlay}
            onEnded={onEnded}
            src={video}
            tracks={[{ src: 'captions_en.vtt', kind: 'captions', srcLang: 'en', label: 'english_captions' }]}
          />
        </StyledVideoWrapper>
      </div>
    </Modal>
  );
};
export default Onboarding;
