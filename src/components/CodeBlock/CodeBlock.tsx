import React from 'react';
import Highlight from 'react-highlight';
import * as SC from './styles';
import '../../../node_modules/highlight.js/styles/magula.css';

const CodeBlock: React.FC = () => {
  return (
    <SC.Wrapper>
      <Highlight className="javascript">
        {
          "\n  id: 'hubspot',\n  name: 'HubSpot',\n  smallIcon: '/images/hubspot.svg',\n  largeIcon: '/images/hubspot.svg',\n  version: '1.0.0',  \n  tags: {\n    catalog: 'hubspot,crm,sales,intro,popular',\n  },"
        }
      </Highlight>
    </SC.Wrapper>
  );
};

export default CodeBlock;
