import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface Option {
  value: string;
  label: string;
}

interface Props {
  defaultOptions: Option[] | string;
  onChange?: (value: string) => void;
}

const MultiSelect = ({ defaultOptions, onChange }: Props) => {
  const [options, setOptions] = useState<Option[]>();
  const [value, setValue] = useState<Option[]>();

  useEffect(() => {
    if (options) {
      return;
    }

    if (typeof defaultOptions === 'string') {
      const initialOptions = defaultOptions.split(' ').map((option) => {
        return { value: option, label: option };
      });
      setOptions(initialOptions);
      setValue(initialOptions);
    } else {
      setOptions(defaultOptions);
      setValue(defaultOptions);
    }
  }, [defaultOptions, options]);

  return (
    <CreatableSelect
      value={value}
      isMulti
      onChange={(newSelectedValues) => {
        const newValues = newSelectedValues as Option[];
        const singleValueString = newValues
          .map((val) => {
            return val.value;
          })
          .join(' ');
        setValue(newValues);
        onChange?.(singleValueString);
      }}
      closeMenuOnSelect={false}
      components={animatedComponents}
      options={options}
    />
  );
};

export default MultiSelect;
