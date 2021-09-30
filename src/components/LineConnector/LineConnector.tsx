import React from 'react';
import Xarrow, { xarrowPropsType } from 'react-xarrows';

const xarrowProps: Partial<xarrowPropsType> = {
  color: '#333333',
  strokeWidth: 1,
  headSize: 10,
  tailSize: 10,
  showTail: true,
  showHead: true,
  path: 'grid',
  dashness: { animation: 1, strokeLen: 2, nonStrokeLen: 8 },
};

const LineConnector: React.FC<xarrowPropsType> = (props) => {
  return <Xarrow {...xarrowProps} {...props} />;
};

export default LineConnector;
