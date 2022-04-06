import React from 'react';
import styled from 'styled-components';

const StyledVideo = styled.video`
  position: relative;
  width: 100%;
  height: 524px;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

interface Props extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  tracks: React.TrackHTMLAttributes<HTMLTrackElement>[];
}

const Video: React.FC<Props> = ({ src, tracks, children, ...props }) => {
  return (
    <StyledVideo src={src} controls {...props}>
      {tracks.map((track) => (
        <track key={track.src} {...track} />
      ))}
      {children}
      <p>Your browser does not support HTML5 video.</p>
    </StyledVideo>
  );
};

export default Video;
