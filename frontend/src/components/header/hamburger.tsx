import React from 'react';
import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import UsersListItem from './usersListItem';
import LogoutBtn from './logoutBtn';
import OrganizerListItem from './organizerListItem';
import { Box, IconButton, List, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  toggleMenu: (isMenuOpen: boolean) => void;
};

export default function Hamburger({ toggleMenu }: Props) {
  const { user } = useContext(UserContext);
  return (
    <Box sx={{ width: '100vw', position: 'relative' }}>
      <IconButton
        onClick={() => toggleMenu(false)}
        sx={{ position: 'absolute', top: '0.375rem', right: '1.3125rem' }}
      >
        <CloseIcon />
      </IconButton>
      <List
        sx={{
          width: '80%',
          m: '3.125rem auto',
        }}
      >
        <Stack
          direction='column'
          justifyContent='space-between'
          alignItems='center'
        >
          <UsersListItem toggleMenu={toggleMenu} />
          {user?.roleName === 'organizer' ? (
            <OrganizerListItem toggleMenu={toggleMenu} />
          ) : (
            <></>
          )}
          <LogoutBtn />
        </Stack>
      </List>
    </Box>
  );
}
