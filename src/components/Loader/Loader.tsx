import React from 'react';
import { Box, BoxProps, CircularProgress, CircularProgressProps } from '@material-ui/core';

const Loader: React.FC<BoxProps & CircularProgressProps> = ({ size = 20, ...props }) => {
  return (
    <Box width="100%" display="flex" alignItems="center" justifyContent="center" {...props}>
      <CircularProgress size={size} {...props} />
    </Box>
  );
};

export default Loader;
