import React, { useRef } from 'react';
import styled from 'styled-components';
import play from '@assets/video-play.svg';
import volume from '@assets/video-volume.svg';
import fullscreen from '@assets/video-fullscreen.svg';
import { Box, Slider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledVideo = styled.video`
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;

  ::-webkit-media-controls {
    display: none !important;
  }

  video::-webkit-media-controls {
    display: none !important;
  }

  video::-webkit-media-controls-enclosure {
    display: none !important;
  }

  .custom-video-controls {
    z-index: 2147483647;
  }
`;

const StyledControlsWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-radius: 8px;
  padding: 12px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1));
`;

const StyledIcon = styled.img`
  height: 24px;
  width: 24px;
  object-fit: contain;
`;

const StyledVolumeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
`;

const StyledSlider = styled(Slider)`
  width: 70px;
  color: white;
  margin-left: 14px;
`;

interface Props extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  tracks: React.TrackHTMLAttributes<HTMLTrackElement>[];
}

const Video: React.FC<Props> = ({ src, tracks, children, ...props }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [volumeLevel, setVolume] = React.useState<number | number[]>(60);

  const handleVolumeChange = (event: React.ChangeEvent<{}>, newVolume: number | number[]) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = (volumeLevel as number) / 100;
    }
  };

  const handlePlayState = () => {
    if (videoRef.current) {
      const isStopped = videoRef.current.paused;
      if (isStopped) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <StyledWrapper>
      <StyledVideo ref={videoRef} src={src} {...props}>
        {tracks.map((track) => (
          <track key={track.src} {...track} />
        ))}
        {children}
        <p>Your browser does not support HTML5 video.</p>
      </StyledVideo>
      <StyledControlsWrapper>
        <Box display="flex" alignItems="center">
          <IconButton color="secondary" onClick={handlePlayState}>
            <StyledIcon src={play} alt="play" />
          </IconButton>
          <StyledVolumeWrapper>
            <StyledIcon src={volume} alt="volume" />
            <StyledSlider
              color="secondary"
              value={volumeLevel}
              onChange={handleVolumeChange}
              aria-labelledby="volume"
            />
          </StyledVolumeWrapper>
          <IconButton onClick={handleFullscreen} color="secondary" style={{ margin: '0 0 0 auto' }}>
            <StyledIcon src={fullscreen} alt="fullscreen" />
          </IconButton>
        </Box>
      </StyledControlsWrapper>
    </StyledWrapper>
  );
};

export default Video;
