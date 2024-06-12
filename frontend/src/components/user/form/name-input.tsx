import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { User, UserInputForm } from '@/types/pages.types';

type Props = {
  name: string;
  label: string;
  setUserName: <K extends keyof UserInputForm>(
    key: K,
    value: UserInputForm[K]
  ) => void;
  type: keyof UserInputForm;
  disabled: boolean;
};

export default function NameInput(props: Props) {
  return (
    <FormControl required fullWidth>
      <TextField
        type='text'
        label={props.label}
        value={props.name}
        onChange={(event) => props.setUserName(props.type, event.target.value)}
        required
        inputProps={{ maxLength: 25 }}
        error={props.name.length >= 25 ? true : false}
        disabled={props.disabled}
      />
    </FormControl>
  );
}
