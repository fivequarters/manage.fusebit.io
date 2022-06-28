import { withJsonFormsControlProps } from '@jsonforms/react';
import { RankedTester, rankWith, scopeEndsWith, ControlProps } from '@jsonforms/core';
import MultiSelect from '../MultiSelect/MultiSelect';

interface Props extends ControlProps {
  data: any;
  handleChange(path: string, value: string): void;
  path: string;
}

const MultiSelectControl = ({ data, handleChange, path, ...props }: Props) => {
  console.log(props);
  return (
    <MultiSelect
      placeholder="Bot Token Scopes*"
      defaultOptions={data}
      onChange={(value: string) => handleChange(path, value)}
    />
  );
};

export const MultiSelectControlTester: RankedTester = rankWith(3, scopeEndsWith('scope'));

export default withJsonFormsControlProps(MultiSelectControl);
