import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { User } from '@/types/types';

type Props = {
  name: string;
  setName: (
    name: string,
    setUserName: React.Dispatch<React.SetStateAction<User>>
  ) => void;
  label: string;
  setUserName: React.Dispatch<React.SetStateAction<User>>;
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
      />
    </FormControl>
  );
}
