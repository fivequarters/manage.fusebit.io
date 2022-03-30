import React from 'react';
import console from '@assets/console.svg';
import play from '@assets/play-black.svg';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';

const Tools: React.FC = () => {
  return (
    <CustomNavBase title="Tools">
      <CustomNavItem icon={console} name="Edit Locally (CLI)" />
      <CustomNavItem icon={play} name="Sample App" />
    </CustomNavBase>
  );
};

export default Tools;
