import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface Option {
  value: string;
  label: string;
}

interface Props {
  placeholder?: string;
  defaultOptions: Option[] | string;
  onChange?: (value: string) => void;
}

const MultiSelect = ({ defaultOptions, onChange, placeholder }: Props) => {
  const [options, setOptions] = useState<Option[]>();
  const [value, setValue] = useState<Option[]>();

  const initValues = (values: Option[]) => {
    setOptions(values);
    setValue(values);
  };

  useEffect(() => {
    if (options) {
      return;
    }

    if (typeof defaultOptions === 'string') {
      const initialOptions = defaultOptions.split(' ').map((option) => {
        return { value: option, label: option };
      });
      initValues(initialOptions);
    } else {
      initValues(defaultOptions);
    }
  }, [defaultOptions, options]);

  return (
    <CreatableSelect
      placeholder={placeholder}
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
      styles={{
        control: (provided) => {
          const marginTop = '11px';

          return { ...provided, marginTop };
        },
        menu: () => ({
          zIndex: 10,
          boxShadow: '0px 20px 48px rgba(52, 72, 123, 0.1)',
          marginTop: '5px',
          borderRadius: '8px',
        }),
      }}
    />
  );
};

export default MultiSelect;
