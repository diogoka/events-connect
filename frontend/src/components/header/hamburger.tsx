import React from 'react';
import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import UsersListItem from './usersListItem';
import LogoutBtn from './logoutBtn';
import OrganizerListItem from './organizerListItem';
import { Box, IconButton, List, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Logo from './logo';

type Props = {
  toggleMenu: (isMenuOpen: boolean) => void;
};

export default function Hamburger({ toggleMenu }: Props) {
  const { user } = useContext(UserContext);
  return (
    <Box sx={{ width: '100vw', height: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#FBF8FF',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 24px',
        }}
      >
        <Logo closeMenu={toggleMenu} />
        <IconButton onClick={() => toggleMenu(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List
        sx={{
          backgroundColor: 'primary.main',
          padding: '40px 24px',
          height: '100%',
        }}
      >
        <UsersListItem toggleMenu={toggleMenu} role={user?.roleName!} />
      </List>
    </Box>
  );
}
