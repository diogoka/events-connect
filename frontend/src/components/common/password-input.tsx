'use client'
import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { TextField } from '@mui/material';

type Props = {
  label: string;
  setter: (value: string) => void;
}

const iconStyle = {
  fontSize: '1.5rem',
  color: '#AAAAAA',
  position: 'absolute',
  inset: '50% 0 auto auto',
  transform: 'translate(-100%, -50%)',
  zIndex: 50,
}

export default function PasswordInput(props: Props) {

  const [isVisible, setIsVisible] = useState(false);

  const onClickIcon = () => {
    setIsVisible(!isVisible);
  }

  return (
    <>
      <TextField
        type={isVisible ? 'text' : 'password'}
        label={props.label}
        onChange={(event) => props.setter(event.target.value)}
        required
      >
      </TextField>
      { isVisible
        ? <AiOutlineEyeInvisible onClick={onClickIcon} style={iconStyle} />
        : <AiOutlineEye onClick={onClickIcon} style={iconStyle} />
       }
    </>
  )
}
