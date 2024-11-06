import React, { ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';
import { UserInputForm } from '@/types/pages.types';

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
  setStudentID: <K extends keyof UserInputForm>(
    key: K,
    value: UserInputForm[K]
  ) => void;
  maxLength: number;
  disabled: boolean;
  type: keyof UserInputForm;
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
        props.setStudentID(props.type, parseInt(event.target.value));
      }}
      disabled={props.disabled}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            border: 'none',
          },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
          },
        },
        backgroundColor: '#F5F2FA',
        borderRadius: '6px',
      }}
    />
  );
};

export default NumberTextFieldInput;
