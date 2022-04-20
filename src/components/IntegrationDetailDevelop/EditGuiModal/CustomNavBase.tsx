import React from 'react';
import NavCategoryTooltip from './NavCategoryTooltip';

interface Props {
  title: string;
  tooltipDescription: string;
}

const CustomNavBase: React.FC<Props> = ({ title, tooltipDescription, children }) => {
  return (
    <div>
      <div>&nbsp;</div>
      <div className="fusebit-nav-category">
        {title}
        <NavCategoryTooltip title={title} description={tooltipDescription} />
      </div>
      {children}
    </div>
  );
};

export default CustomNavBase;
