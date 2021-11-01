import React, { useState } from 'react';

const useAnchor = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClickAnchor = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return {
    anchorEl,
    setAnchorEl,
    handleClickAnchor,
    handleCloseMenu,
  };
};

export default useAnchor;
