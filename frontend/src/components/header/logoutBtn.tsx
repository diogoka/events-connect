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
      sx={{
        color: 'primary.contrastText',
        width: '100%',
        textAlign: 'start',
        display: 'flex',
        justifyContent: 'start',
        fontSize: '40px',
      }}
    >
      Log out
    </Button>
  );
}
