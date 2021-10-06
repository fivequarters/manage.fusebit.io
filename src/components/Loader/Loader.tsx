import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

const Loader: React.FC = () => {
  return (
    <Box width="100%" display="flex" alignItems="center" justifyContent="center">
      <CircularProgress style={{ height: '20px', width: '20px' }} />
    </Box>
  );
};

export default Loader;
