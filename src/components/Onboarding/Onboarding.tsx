import Modal from '@components/common/Modal';
import video from '@assets/demo-video.mp4';
import { Backdrop, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@hooks/useQuery';

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

const StyledVideo = styled.video`
  width: 100%;
  height: 524px;
  object-fit: cover;
  border-radius: 8px;
`;

const Onboarding: React.FC = () => {
  const [open, setOpen] = useState(false);
  const query = useQuery();

  useEffect(() => {
    const utmContent = query.get('utm_content');
    if (utmContent === 'new-vid') {
      setOpen(true);
    }
  }, [query]);

  return (
    <Modal fullScreen disableActions disableClose open={open} closeAfterTransition BackdropComponent={Backdrop}>
      <Container maxWidth="lg">
        <StyledTitle>Almost Done!</StyledTitle>
        <StyledDescription>
          Now that you are signed up to Fusebit, let's get you ready to{' '}
          <strong>start building a code-first integration in minutes.</strong> Watch the demo below on a few key
          developer concepts.
        </StyledDescription>
        <StyledVideo src={video} controls width="100%" height="100%">
          <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
          <p>Your browser does not support HTML5 video.</p>
        </StyledVideo>
      </Container>
    </Modal>
  );
};
export default Onboarding;
