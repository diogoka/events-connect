import React from 'react';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import Logo from './logo';
import MenuList from './menuList';
import { Toolbar, Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function HeaderPC() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  return (
    <Toolbar
      disableGutters
      sx={{
        justifyContent: 'space-between',
        width: '90%',
        margin: '0 auto',
      }}
    >
      <Logo />
      {user ? (
        <>
          <MenuList />
        </>
      ) : (
        <Button
          onClick={() => router.push('/login')}
          variant='contained'
          color='primary'
          startIcon={<LoginIcon />}
          sx={{ width: '7rem', padding: '2rem 1rem', borderRadius: 0 }}
        >
          Log in
        </Button>
      )}
    </Toolbar>
  );
}
