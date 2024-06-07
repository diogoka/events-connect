import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { User } from '@/types/pages.types';

type Props = {
  name: string;
  setName: (
    name: string,
    setUserName: React.Dispatch<React.SetStateAction<User>>
  ) => void;
  label: string;
  setUserName: React.Dispatch<React.SetStateAction<User>>;
  disable: boolean;
};

export default function NameInput(props: Props) {
  return (
    <FormControl required fullWidth>
      <TextField
        type='text'
        label={props.label}
        value={props.name}
        onChange={(event) =>
          props.setName(event.target.value, props.setUserName)
        }
        required
        inputProps={{ maxLength: 25 }}
        error={props.name.length >= 25 ? true : false}
        disabled={props.disable}
      />
    </FormControl>
  );
}
