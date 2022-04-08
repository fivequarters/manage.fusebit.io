import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import play from '@assets/video-play.svg';
import playOutlined from '@assets/video-play-outlined.svg';
import pause from '@assets/video-pause.svg';
import volume from '@assets/video-volume.svg';
import fullscreen from '@assets/video-fullscreen.svg';
import { Box, Slider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledShadow = styled.div<{ isVideoPaused: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  backdrop-filter: blur(12px);
  border-radius: 8px;
  padding: 12px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.5));
  opacity: ${(props) => (props.isVideoPaused ? 1 : 0)};
  transition: all 0.25s linear;
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

const StyledIcon = styled.img<{ height?: string; width?: string }>`
  height: ${(props) => (props.height ? props.height : '24px')};
  width: ${(props) => (props.width ? props.width : '24px')};
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

const StyledTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  color: white;
`;

const StyledTime = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: white;
`;

interface Props extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  tracks: React.TrackHTMLAttributes<HTMLTrackElement>[];
}

const Video: React.FC<Props> = ({ src, tracks, children, ...props }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [volumeLevel, setVolume] = React.useState<number | number[]>(60);
  const [currentTime, setCurrentTime] = React.useState('00:00');
  const [duration, setDuration] = React.useState('00:00');
  const [progress, setProgress] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleVolumeChange = (event: React.ChangeEvent<{}>, newVolume: number | number[]) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = (volumeLevel as number) / 100;
    }
  };

  const handlePlayState = useCallback(() => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  const formatTime = (seconds: any) => {
    let minutes: any = Math.floor(seconds / 60);
    minutes = minutes >= 10 ? minutes : `0${minutes}`;
    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`;
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const updatedTime = formatTime(e.currentTarget.currentTime);
    const updatedProgress = (e.currentTarget.currentTime * 100) / e.currentTarget.duration;
    setCurrentTime(updatedTime);
    setProgress(updatedProgress);
  };

  const handleOnCanPlay = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setDuration(formatTime(e.currentTarget.duration));
  };

  const handleKeyUp = useCallback(
    (e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ') {
        handlePlayState();
      }
    },
    [handlePlayState]
  );

  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      handleKeyUp(e);
    });

    return window.removeEventListener('keyup', () => {});
  }, [handleKeyUp]);

  return (
    <StyledWrapper>
      <StyledVideo
        onCanPlay={handleOnCanPlay}
        id="video"
        onTimeUpdate={handleTimeUpdate}
        ref={videoRef}
        src={src}
        {...props}
      >
        {tracks.map((track) => (
          <track key={track.src} {...track} />
        ))}
        {children}
        <p>Your browser does not support HTML5 video.</p>
      </StyledVideo>
      <StyledShadow onClick={handlePlayState} isVideoPaused={!isPlaying}>
        {!isPlaying && (
          <Box position="absolute" top="45%" left="50%" style={{ transform: 'translate(-50%, -50%)' }}>
            <IconButton color="secondary">
              <StyledIcon height="96px" width="96px" src={playOutlined} alt="play" />
            </IconButton>
          </Box>
        )}
      </StyledShadow>
      <StyledControlsWrapper onKeyUp={handleKeyUp}>
        <Box mb="5px">
          <LinearProgress color="primary" variant="determinate" value={progress} />
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton color="secondary" onClick={handlePlayState}>
            <StyledIcon height="14px" width="14px" src={isPlaying ? pause : play} alt="play" />
          </IconButton>
          <StyledVolumeWrapper onKeyUp={handleKeyUp}>
            <StyledIcon src={volume} alt="volume" />
            <StyledSlider
              color="secondary"
              value={volumeLevel}
              onChange={handleVolumeChange}
              aria-labelledby="volume"
            />
          </StyledVolumeWrapper>
          <StyledTimeWrapper>
            <StyledTime>
              {currentTime} / {duration}
            </StyledTime>
          </StyledTimeWrapper>
          <IconButton onClick={handleFullscreen} color="secondary" style={{ margin: '0 0 0 auto' }}>
            <StyledIcon src={fullscreen} alt="fullscreen" />
          </IconButton>
        </Box>
      </StyledControlsWrapper>
    </StyledWrapper>
  );
};

export default Video;
