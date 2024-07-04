'use client';

import { Button, Box } from '@mui/material';
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';

const buttonStyle = {
  width: '9rem',
  '&:hover': {
    transform: 'translateY(-0.5px)',
    boxShadow: '3px 3px 6px 0px rgba(0, 0, 0, 0.5)',
  },
  '&: active': {
    transform: 'translateY(0.5px);',
  },
};

const ButtonsHomePage = () => {
  const { user, loginStatus } = useContext(UserContext);
  const router = useRouter();

  console.log('loginStatus', loginStatus);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        gap: '9px',
      }}
    >
      {loginStatus !== 'Logged In' && (
        <Button
          variant='contained'
          color='primary'
          sx={buttonStyle}
          onClick={() => {
            !user ? router.push('/login') : router.push('/events');
          }}
        >
          Sign Up
        </Button>
      )}
      <Button
        variant='contained'
        color='primary'
        sx={buttonStyle}
        onClick={() => {
          router.push('/events');
        }}
      >
        See Events
      </Button>
    </Box>
  );
};

export default ButtonsHomePage;
