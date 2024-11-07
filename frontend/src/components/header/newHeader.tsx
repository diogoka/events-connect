import React from 'react';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import { Button, Box } from '@mui/material';

import AvatarIcon from './avatar';

type Props = {
  laptopQuery: boolean;
};

const NewHeader = ({ laptopQuery }: Props) => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const onNewEventClick = () => {
    router.push('/events/new');
  };
  return (
    <Box>
      {user ? (
        <>
          {user.roleId === 1 && laptopQuery && (
            <Button
              variant='contained'
              sx={{ marginRight: '12px', padding: '0 12px' }}
              onClick={onNewEventClick}
            >
              + New Event
            </Button>
          )}
          <AvatarIcon laptopQuery={laptopQuery} />
        </>
      ) : (
        <Button
          onClick={() => router.push('/login')}
          variant='contained'
          color='primary'
          sx={{ width: '7rem', padding: '2rem 1rem' }}
        >
          Log in
        </Button>
      )}
    </Box>
  );
};

export default NewHeader;
