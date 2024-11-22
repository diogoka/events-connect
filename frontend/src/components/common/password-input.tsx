'use client';
import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { TextField } from '@mui/material';
import { UserInputForm } from '@/types/pages.types';

type Props = {
  label: string;
  setter: <K extends keyof UserInputForm>(
    key: K,
    value: UserInputForm[K]
  ) => void;
  type: keyof UserInputForm;
  local?: string;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  disabled: boolean;
};

const iconStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  color: '#AAAAAA',
  position: 'absolute',
  inset: '50% 0 auto auto',
  transform: 'translate(-100%, -50%)',
  zIndex: 50,
};

export default function PasswordInput(props: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const onClickIcon = () => {
    setIsVisible(!isVisible);
  };

  const onChangeFn = (target: string) => {
    if (props.local === 'login') {
      props.setPassword!(target);
    } else {
      props.setter(props.type, target);
    }
  };

  return (
    <>
      <TextField
        type={isVisible ? 'text' : 'password'}
        label={props.label}
        onChange={(event) => onChangeFn(event.target.value)}
        required
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
      ></TextField>
      {isVisible ? (
        <AiOutlineEyeInvisible onClick={onClickIcon} style={iconStyle} />
      ) : (
        <AiOutlineEye onClick={onClickIcon} style={iconStyle} />
      )}
    </>
  );
}
