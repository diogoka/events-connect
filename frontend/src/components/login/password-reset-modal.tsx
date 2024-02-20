import React, { useState } from 'react'
import { Modal, Typography, TextField, Stack, Button } from '@mui/material'
import {
  getAuth,
  sendPasswordResetEmail
} from 'firebase/auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '500px',
  height: '240px',
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  p: '20px',
};

type Props = {
  isPasswordReset: boolean;
  setIsPasswordReset: (isPasswordReset: boolean) => void;
}

enum PasswordResetStatus {
  BeforeSending,
  Successful,
  Failed
}

export default function PasswordResetModal(props: Props) {

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(PasswordResetStatus.BeforeSending);

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    sendPasswordResetEmail(getAuth(), email)
      .then(() => {
        setStatus(PasswordResetStatus.Successful);
      })
      .catch(() => {
        setStatus(PasswordResetStatus.Failed);
      })
  }

  let component;
  if (status === PasswordResetStatus.BeforeSending) {
    component = (
      <form onSubmit={handlePasswordReset} style={{ width: '100%' }}>
        <Stack rowGap={'20px'}>
          <Typography variant='h6' align='center'>
            Reset Password
          </Typography>
          <TextField type='email' label='Email' onChange={(event) => setEmail(event.target.value)} required fullWidth />
          <Button
            type='submit'
            onClick={() => sendPasswordResetEmail(getAuth(), email)}
            variant='contained'
            sx={{ width: '100px', marginInline: 'auto' }}
          >
            OK
          </Button>
        </Stack>
      </form>
    )
  } else if (status === PasswordResetStatus.Successful) {
    component =
      <Typography align='center'>
        Password reset email sent successfully.<br />
        Please check your inbox.
      </Typography>
  } else {
    component =
      <Typography align='center'>
        Failed to send email.<br />
        Please check your email address and try again.
      </Typography>
  }

  return (
    <Modal
      open={props.isPasswordReset}
      onClose={() => {
        props.setIsPasswordReset(false);
        setStatus(PasswordResetStatus.BeforeSending);
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Stack sx={style}>
        {component}
      </Stack>
    </Modal>
  )
}
