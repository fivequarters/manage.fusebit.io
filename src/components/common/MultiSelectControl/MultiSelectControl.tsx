import React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { RankedTester, rankWith, scopeEndsWith } from '@jsonforms/core';
import MultiSelect from '../MultiSelect/MultiSelect';

interface Props {
  data: any;
  handleChange(path: string, value: string): void;
  path: string;
}

const MultiSelectControl = ({ data, handleChange, path }: Props) => {
  return <MultiSelect defaultOptions={data} onChange={(value: string) => handleChange(path, value)} />;
};

export const MultiSelectControlTester: RankedTester = rankWith(3, scopeEndsWith('scope'));

export default withJsonFormsControlProps(MultiSelectControl);
