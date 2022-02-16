import React from 'react';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

interface Props {
  image: string;
  css?: FlattenSimpleInterpolation;
}

const StyledBackgroundImage = styled.div<{ image: string; css?: FlattenSimpleInterpolation }>`
  background-image: url(${(props) => props.image && props.image});
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0px;
  top: -30px;
  opacity: 0.55;
  filter: blur(2px);
  ${(props) => props.css && props.css};
`;

const BackgroundImage: React.FC<Props> = ({ image, css }) => {
  return <StyledBackgroundImage image={image} css={css} />;
};

export default BackgroundImage;
