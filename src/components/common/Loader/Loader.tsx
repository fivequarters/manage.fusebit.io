import React from 'react';
import { Box, CircularProgress, CircularProgressProps } from '@material-ui/core';

interface Props extends CircularProgressProps {
  className?: string;
}

const Loader: React.FC<Props> = ({ size = 20, className, ...props }) => {
  return (
    <Box width="100%" display="flex" alignItems="center" justifyContent="center" className={className}>
      <CircularProgress size={size} {...props} />
    </Box>
  );
};

export default Loader;
