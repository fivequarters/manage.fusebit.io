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
  const [options, setOptions] = useState<Option[]>([]);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (typeof defaultOptions === 'string') {
      const initialOptions = defaultOptions.split(' ').map((option) => {
        return { value: option, label: option };
      });
      setOptions(initialOptions);
    } else {
      setOptions(defaultOptions);
    }
  }, [defaultOptions]);

  useEffect(() => {
    if (value && onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <CreatableSelect
      isMulti
      onChange={(newOptions) => {
        const newValues = newOptions as Option[];
        const singleValueString = newValues
          .map((val) => {
            return val.value;
          })
          .join(' ');
        setValue(singleValueString);
      }}
      closeMenuOnSelect={false}
      components={animatedComponents}
      options={options}
    />
  );
};

export default MultiSelect;
