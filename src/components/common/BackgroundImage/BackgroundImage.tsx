import React from 'react';
import styled from 'styled-components';

interface Props {
  image: string;
  css?: string;
}

const StyledBackgroundImage = styled.div<{ image: string; css?: string }>`
  ${(props) => props.css && props.css};
  background-image: url(${(props) => props.image && props.image});
  background-repeat: no-repeat;
  background-size: contain;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 30px;
  top: -30px;
  opacity: 0.55;
  filter: blur(1.5px);
`;

const BackgroundImage: React.FC<Props> = ({ image, css }) => {
  return <StyledBackgroundImage image={image} css={css} />;
};

export default BackgroundImage;
