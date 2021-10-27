import React, { useState } from 'react';

const useAnchor = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return {
    anchorEl,
    setAnchorEl,
    handleClick,
    handleClose,
  };
};

export default useAnchor;
