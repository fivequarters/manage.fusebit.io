import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { Option } from '@interfaces/multiSelect';

const animatedComponents = makeAnimated();

interface Props {
  placeholder?: string;
  defaultOptions: Option[];
  allowArbitraryCreation?: boolean;
  onChange?: (values: string[]) => void;
}

const MultiSelect = ({ defaultOptions, onChange, placeholder, allowArbitraryCreation }: Props) => {
  const [value, setValue] = useState<Option[]>(defaultOptions);

  return (
    <CreatableSelect
      placeholder={placeholder}
      value={value}
      isMulti
      menuPosition="fixed"
      isValidNewOption={() => {
        return !!allowArbitraryCreation;
      }}
      isClearable={!value.find((v) => v.immutable)}
      onChange={(newSelectedValues) => {
        const newValues = newSelectedValues as Option[];
        const newValuesStringArray = newValues.map((val) => {
          return val.value;
        });
        setValue(newValues);
        onChange?.(newValuesStringArray);
      }}
      closeMenuOnSelect={false}
      components={animatedComponents}
      options={defaultOptions}
      styles={{
        control: (provided) => {
          const marginTop = '11px';

          return { ...provided, marginTop };
        },
        menu: () => ({
          zIndex: 10,
          marginTop: '5px',
          background: 'white',
          boxShadow: '0px 20px 48px rgba(52, 72, 123, 0.1)',
          borderRadius: '8px',
        }),
        multiValue: (base, state: any) => {
          const option = state.data as Option;
          return option.immutable ? { ...base, backgroundColor: '#F83420' } : base;
        },
        multiValueLabel: (base, state: any) => {
          const option = state.data as Option;
          return option.immutable ? { ...base, color: 'white', paddingRight: 6 } : base;
        },
        multiValueRemove: (base, state: any) => {
          const option = state.data as Option;
          return option.immutable ? { ...base, display: 'none' } : base;
        },
      }}
    />
  );
};

export default MultiSelect;
