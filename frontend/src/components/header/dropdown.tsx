import React from 'react';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import { LoginStatus } from '@/types/context.types';
import { getAuth, signOut } from 'firebase/auth';
import { Menu, MenuItem, Avatar, ListItemIcon } from '@mui/material';
import Logout from '@mui/icons-material/Logout';

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
};

export default function Dropdown({ anchorEl, open, handleClose }: Props) {
  const { user, setUser, setLoginStatus, firebaseAccount, setFirebaseAccount } =
    useContext(UserContext);

  const router = useRouter();
  const clickHandler = () => {
    router.push('/user');
  };

  const handleLogout = async () => {
    signOut(getAuth())
      .then(() => {
        setFirebaseAccount(null);
        setUser(null);
        setLoginStatus(LoginStatus.LoggedOut);
      })
      .catch((error) => {
        console.error(error);
      });
    router.push('/login');
  };
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      sx={{
        overflow: 'visible',
        mt: 1,
        '& .MuiList-root': {
          padding: 0,
        },
      }}
    >
      <MenuItem onClick={clickHandler}>My Events</MenuItem>
      <MenuItem onClick={handleLogout} sx={{ gap: '5px' }}>
        Log out
        <ListItemIcon>
          <Logout fontSize='small' sx={{ paddingLeft: '2px' }} />
        </ListItemIcon>
      </MenuItem>
    </Menu>
  );
}
