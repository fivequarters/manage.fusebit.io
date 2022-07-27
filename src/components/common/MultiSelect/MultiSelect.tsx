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
        control: (base) => ({
          ...base,
          marginTop: '11px',
          border: 'none',
          borderRadius: '0',
          borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
          paddingBottom: '8px',
          boxShadow: 'none',
          transition: 'all .2s ease-in-out',

          '&:hover': {
            borderBottom: '2px solid #F83420',
          },
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: '#333333',
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        valueContainer: (base) => ({
          ...base,
          paddingLeft: 0,
        }),
        menu: () => ({
          zIndex: 10,
          marginTop: '5px',
          background: 'white',
          boxShadow: '0px 20px 48px rgba(52, 72, 123, 0.1)',
          borderRadius: '8px',
        }),
        multiValue: (base, state: any) => {
          const option = state.data as Option;
          return option.immutable
            ? { ...base, borderRadius: '200px', backgroundColor: '#DEDCDC' }
            : { ...base, borderRadius: '200px', backgroundColor: 'rgba(215, 229, 255, 0.4)' };
        },
        multiValueLabel: (base, state: any) => {
          const option = state.data as Option;
          return option.immutable ? { ...base, color: '#333333', paddingRight: 6 } : { ...base, color: '#333333' };
        },
        multiValueRemove: (base, state: any) => {
          const option = state.data as Option;
          return option.immutable
            ? { ...base, display: 'none' }
            : { ...base, borderRadius: '200px', cursor: 'pointer', transition: 'all .2s ease-in-out' };
        },
      }}
    />
  );
};

export default MultiSelect;
