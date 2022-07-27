import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { Option } from '@interfaces/multiSelect';
import styled from 'styled-components';

const animatedComponents = makeAnimated();

interface Props {
  placeholder?: string;
  defaultOptions: Option[];
  allowArbitraryCreation?: boolean;
  onChange?: (values: string[]) => void;
}

const StyledPlaceholder = styled.div<{ isFocused: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.isFocused ? ' var(--primary-color)' : 'var(--black)')};
  transform: translateY(-5.5px);
  transition: all 0.15s ease-in-out;
`;

const MultiSelect = ({ defaultOptions, onChange, placeholder, allowArbitraryCreation }: Props) => {
  const [value, setValue] = useState<Option[]>(defaultOptions);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <StyledPlaceholder isFocused={isFocused}>{placeholder}</StyledPlaceholder>
      <CreatableSelect
        value={value}
        isMulti
        isValidNewOption={(val: string) => {
          return val !== '';
        }}
        isSearchable={allowArbitraryCreation}
        isClearable={false}
        onChange={(newSelectedValues: any) => {
          const newValues = newSelectedValues as Option[];
          const newValuesStringArray = newValues.map((val) => {
            return val.value;
          });
          setValue(newValues);
          onChange?.(newValuesStringArray);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={defaultOptions}
        styles={{
          container: (base: any) => ({
            ...base,
            marginBottom: '48px',
          }),
          control: (base: any, state) => ({
            ...base,
            marginTop: '0px',
            border: 'none',
            borderRadius: '0',
            paddingBottom: '4px',
            borderBottom: state.isFocused ? '1px solid #F83420' : '1px solid rgba(0, 0, 0, 0.4)',
            boxShadow: 'none',
            transition: 'all 0.15s ease-in-out',

            '&:before': {
              content: '""',
              visibility: state.isFocused ? 'visible' : 'hidden',
              position: 'absolute',
              bottom: '-1px',
              left: state.isFocused ? 0 : '55%',
              height: '2px',
              width: state.isFocused ? '100%' : '0',
              transform: state.isFocused ? 'translateX(0)' : 'translateX(-50%)',
              background: '#F83420',
              zIndex: 2,
              transition: 'all 0.25s ease-in-out',
            },

            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: state.isFocused ? '1px' : '0',
              background: '#333333',
              boxShadow: 'none',
              transition: 'all 0.15s ease-in-out',
            },

            '&:hover': {
              borderColor: '#333333',
              cursor: 'text',

              '&:after': {
                height: '1px',
              },

              '&:before': {
                visibility: state.isFocused ? 'visible' : 'hidden',
                width: state.isFocused ? '100%' : '30%',
                transition: state.isFocused ? 'all 0.15s ease-in-out' : 'none',
              },
            },
          }),
          dropdownIndicator: (base: any) => ({
            ...base,
            color: '#333333',

            '&:hover': {
              color: '#333333',
              cursor: 'pointer',
            },
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          valueContainer: (base: any) => ({
            ...base,
            paddingLeft: 0,
          }),
          menu: () => ({
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            marginTop: '5px',
            background: 'white',
            boxShadow: '22px 1px 48px rgb(52 72 123 / 10%)',
            borderRadius: '8px',
          }),
          menuList: (base) => ({
            ...base,
            maxHeight: '112px',
            overflowY: 'scroll',
          }),
          multiValue: (base: any, state) => {
            const option = state.data as Option;
            return option.immutable
              ? { ...base, borderRadius: '200px', backgroundColor: '#DEDCDC' }
              : { ...base, borderRadius: '200px', backgroundColor: 'rgba(215, 229, 255, 0.4)' };
          },
          multiValueLabel: (base: any, state) => {
            const option = state.data as Option;
            return option.immutable ? { ...base, color: '#333333', paddingRight: 6 } : { ...base, color: '#333333' };
          },
          multiValueRemove: (base: any, state) => {
            const option = state.data as Option;
            return option.immutable
              ? { ...base, display: 'none' }
              : { ...base, borderRadius: '200px', cursor: 'pointer', transition: 'all .2s ease-in-out' };
          },
        }}
      />
    </>
  );
};

export default MultiSelect;
