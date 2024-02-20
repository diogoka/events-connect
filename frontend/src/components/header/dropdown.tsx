import React from 'react';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext, LoginStatus } from '@/context/userContext';
import { getAuth, signOut } from 'firebase/auth';
import { Menu, MenuItem, Avatar, ListItemIcon } from '@mui/material';
import Logout from '@mui/icons-material/Logout';

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
};

export default function Dropdown({ anchorEl, open, handleClose }: Props) {
  const { user, setUser, setLoginStatus, firebaseAccount } =
    useContext(UserContext);

  const router = useRouter();
  const clickHandler = () => {
    router.push('/user');
  };

  const handleLogout = async () => {
    signOut(getAuth())
      .then(() => {
        setUser(null);
        setLoginStatus(LoginStatus.LoggedOut);
      })
      .catch((error) => {
        console.error(error);
      });
    router.push('/');
  };
  return (
    <Menu
      anchorEl={anchorEl}
      id='account-menu'
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      sx={{
        overflow: 'visible',
        mt: 1.5,
        '& .MuiList-root': {
          padding: 0,
        },
        '& .MuiAvatar-root': {
          width: 40,
          height: 40,
          ml: -0.5,
          mr: 1,
        },
        '&:before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: 'background.paper',
          transform: 'translateY(-50%) rotate(45deg)',
          zIndex: 0,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem
        onClick={clickHandler}
        disableRipple
        sx={{
          padding: '0 2rem',
          height: '4rem',
          borderBottom: '1px solid rgba(51, 51, 51, 0.1)',
        }}
      >
        <Avatar
          alt={user?.firstName}
          src={`${
            user?.provider === 'password'
              ? user.avatarURL
              : firebaseAccount?.photoURL
          }`}
        />{' '}
        My Profile
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        disableRipple
        sx={{ padding: '.5rem 2rem', height: '4rem' }}
      >
        <ListItemIcon>
          <Logout fontSize='large' sx={{ marginRight: '3px' }} />
        </ListItemIcon>
        Log out
      </MenuItem>
    </Menu>
  );
}
