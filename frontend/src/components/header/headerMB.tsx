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

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      sx={{
        width: '100%',
        height: '59px',
      }}
    >
      {user ? (
        <>
          <HamburgerMenu />
          <Logo />
          <AvatarIcon />
        </>
      ) : (
        <Button
          onClick={() => router.push('/login')}
          sx={{
            backgroundColor: 'primary.main',
            color: '#FFFFFF',
            padding: '8px 16px',
          }}
        >
          Log in
        </Button>
      )}
    </Stack>
  );
}
