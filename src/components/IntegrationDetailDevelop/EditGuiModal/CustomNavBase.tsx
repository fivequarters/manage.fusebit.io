import React from 'react';

interface Props {
  title: string;
}

const CustomNavBase: React.FC<Props> = ({ title, children }) => {
  return (
    <div>
      <div>&nbsp;</div>
      <div className="fusebit-nav-category">{title}</div>
      {children}
    </div>
  );
};

export default CustomNavBase;
