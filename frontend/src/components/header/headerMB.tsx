import React from 'react';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import Logo from './logo';
import PageTitle from './pageTitle';
import { Stack, Button } from '@mui/material';
import AvatarIcon from './avatar';
import LoginIcon from '@mui/icons-material/Login';
import HamburgerMenu from './hamburgerMenu';

export default function HeaderMB() {
  const { user } = useContext(UserContext);

  const router = useRouter();

  const LoginButton = () => {
    return (
      <Button
        onClick={() => router.push('/login')}
        variant='contained'
        color='primary'
        startIcon={<LoginIcon />}
        sx={{
          minWidth: '6.25rem',
          width: '6.25rem',
          height: '100%',
          borderRadius: '0',
        }}
      >
        Log in
      </Button>
    );
  };
  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      sx={{
        width: '100%',
        height: '59px',
        paddingLeft: '40px',
        paddingRight: '40px',
      }}
    >
      <HamburgerMenu />
      {user ? (
        <>
          <Logo />
          <AvatarIcon />
        </>
      ) : (
        LoginButton()
      )}
    </Stack>
  );
}
