import React from 'react';
import { useContext } from 'react';
import { UserContext } from '@/context/userContext';
import { Stack } from '@mui/material';
import UsersListItemPC from './usersListItemPC';
import OrganizerListItemPC from './organizerListItemPC';

export default function Navigation() {
  const { user } = useContext(UserContext);
  return (
    <Stack direction='row' width='100%' sx={{ justifyContent: 'flex-end' }}>
      {user?.roleName === 'student' ? (
        <UsersListItemPC />
      ) : (
        <OrganizerListItemPC />
      )}
    </Stack>
  );
}
