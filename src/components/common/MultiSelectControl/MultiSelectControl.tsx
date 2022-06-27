import React from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import MultiSelect from '../MultiSelect/MultiSelect';

interface Props {
  data: any;
  handleChange(path: string, value: string): void;
  path: string;
}

const MultiSelectControl = ({ data, handleChange, path }: Props) => (
  <MultiSelect defaultOptions={data} onChange={(value: string) => handleChange(path, value)} />
);

export default withJsonFormsControlProps(MultiSelectControl);
