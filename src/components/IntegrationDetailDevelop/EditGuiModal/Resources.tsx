import books from '@assets/library-books.svg';
import code from '@assets/code.svg';
import React from 'react';
import Tree from './Tree';

const Resources: React.FC = () => {
  return (
    <div>
      <div>&nbsp;</div>
      <div className="fusebit-nav-category">Resources</div>
      <Tree name="Documentation" icon={books} enableDropdownArrow>
        <Tree name="page 1" />
        <Tree name="page 2" />
      </Tree>
      <Tree name="Snippets" icon={code} enableDropdownArrow>
        <Tree name="page 1" />
        <Tree name="page 2" />
      </Tree>
    </div>
  );
};

export default Resources;
