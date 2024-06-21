import React from 'react';
import { useContext } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { UserContext } from '@/context/userContext';
import { LoginStatus } from '@/types/context.types';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LogoutBtn() {
  const { setUser, setLoginStatus, setFirebaseAccount } =
    useContext(UserContext);

  const router = useRouter();

  const handleLogout = async () => {
    signOut(getAuth())
      .then(() => {
        setUser(null);
        setFirebaseAccount(null);
        setLoginStatus(LoginStatus.LoggedOut);
        router.push('/login');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Button
      onClick={handleLogout}
      variant='outlined'
      color='error'
      sx={{
        width: '100%',
        m: '3.125rem auto 1.25rem',
      }}
    >
      Log out
    </Button>
  );
}
