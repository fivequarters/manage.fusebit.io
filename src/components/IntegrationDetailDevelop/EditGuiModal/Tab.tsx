import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import styled from 'styled-components';

const TabWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 8px 12px 16px;
  background-color: white;
  width: max-content;
  max-height: 100%;
  cursor: pointer;
`;

const TabName = styled.p`
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  margin-right: 10px;
`;

const Tab: React.FC = ({ children }) => {
  return (
    <TabWrapper>
      <TabName>{children}</TabName>
      <IconButton color="inherit" aria-label="delete tab" style={{ height: '8px', width: '8px' }}>
        <CloseIcon style={{ height: '16px', width: '16px' }} />
      </IconButton>
    </TabWrapper>
  );
};

export default Tab;
