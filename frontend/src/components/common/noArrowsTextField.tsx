import React, { ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const NoArrowsTextField = styled(TextField)(({ theme }) => ({
  '& input[type=number]': {
    '-moz-appearance': 'textfield',
    '-webkit-appearance': 'none',
    margin: 0,
    '&::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '&::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
}));

type Props = {
  label: string;
  setStudentID: React.Dispatch<React.SetStateAction<string>>;
  maxLength: number;
  disable: boolean;
};

const NumberTextFieldInput = (props: Props) => {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, maxLength } = event.target;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
    }
  };

  return (
    <NoArrowsTextField
      type='number'
      label={props.label}
      required
      inputProps={{
        maxLength: props.maxLength,
        onInput: handleInput,
      }}
      onChange={(event) => {
        props.setStudentID(event.target.value);
      }}
      disabled={props.disable}
    />
  );
};

export default NumberTextFieldInput;
