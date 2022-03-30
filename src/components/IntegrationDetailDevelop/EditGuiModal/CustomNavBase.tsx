import React from 'react';
import NavCategoryTooltip from './NavCategoryTooltip';

interface Props {
  title: string;
}

const CustomNavBase: React.FC<Props> = ({ title, children }) => {
  return (
    <div>
      <div>&nbsp;</div>
      <div className="fusebit-nav-category">
        {title}
        <NavCategoryTooltip title={title} description="Random desc" />
      </div>
      {children}
    </div>
  );
};

export default CustomNavBase;
