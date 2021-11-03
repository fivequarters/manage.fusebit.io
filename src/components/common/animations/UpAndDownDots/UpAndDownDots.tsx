import React from 'react';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import { animated, useTrail } from 'react-spring';

const StyledDot = animated(styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  height: 3px;
  width: 3px;
  border-radius: 50%;
  margin: 0 3px -5px;
`);

const dots = [{ key: 'dotOne' }, { key: 'dotTwo' }, { key: 'dotThree' }];

const UpAndDownDots: React.FC = () => {
  const trail = useTrail(dots.length, {
    from: { y: 1, opacity: 0 },
    to: { y: 0, opacity: 1 },
    loop: { reverse: true },
    config: { mass: 1, tension: 300, friction: 24 },
  });

  return (
    <Box display="flex" alignItems="center">
      {trail.map((style, index) => (
        <StyledDot key={dots[index].key} style={style} />
      ))}
    </Box>
  );
};

export default UpAndDownDots;
