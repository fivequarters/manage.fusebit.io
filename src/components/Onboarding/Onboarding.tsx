import Modal from '@components/common/Modal';
import video from '@assets/placeholder-video.mp4';
import { Backdrop, useMediaQuery } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@hooks/useQuery';
import Video from '@components/common/Video';
import { trackEventMemoized } from '@utils/analytics';

const StyledWrapper = styled.div`
  @media only screen and (max-width: 500px) {
    position: relative;
    height: 75%;
  }
`;

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

  @media only screen and (max-width: 500px) {
    height: 100%;
    padding-bottom: 20px;
  }
`;

enum UTM_CONTENT {
  NEW_VID = 'new-vid',
}

const Onboarding: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const query = useQuery();
  const objectLocation = 'Onboarding Video';
  const isMobile = useMediaQuery('(max-width: 500px)');

  useEffect(() => {
    const utmContent = query.get('utm_content');
    if (utmContent === UTM_CONTENT.NEW_VID && !videoCompleted) {
      setOpen(true);
      trackEventMemoized('Product Video Modal Viewed', objectLocation);
    }
  }, [query, videoCompleted]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Cancel the event
      e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const onPlay = () => {
    trackEventMemoized('Product Video Played', objectLocation);
  };

  const onEnded = () => {
    trackEventMemoized('Product Video Completed', objectLocation);
    setVideoCompleted(true);
  };

  return (
    <Modal
      fullScreen={isMobile}
      disableActions
      disableClose
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <StyledWrapper>
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
      </StyledWrapper>
    </Modal>
  );
};
export default Onboarding;
