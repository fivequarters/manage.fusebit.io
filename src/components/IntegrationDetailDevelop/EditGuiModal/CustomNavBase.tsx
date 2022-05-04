import React from 'react';
import NavCategoryTooltip from './NavCategoryTooltip';

interface Props {
  id: string;
  title: string;
  tooltipDescription: string;
}

const CustomNavBase: React.FC<Props> = ({ title, tooltipDescription, id, children }) => {
  return (
    <div>
      <div>&nbsp;</div>
      <div id={id} className="fusebit-nav-category">
        {title}
        <NavCategoryTooltip title={title} description={tooltipDescription} />
      </div>
      {children}
    </div>
  );
};

export default CustomNavBase;
