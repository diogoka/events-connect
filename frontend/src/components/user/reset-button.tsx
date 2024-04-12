import { Button } from '@mui/material';
import React from 'react';

type Props = {
  getEvents: () => void;
  disable: boolean;
};

const ResetButton = ({ getEvents, disable }: Props) => {
  return (
    <Button
      variant={'contained'}
      onClick={getEvents}
      sx={{
        color: 'white',
        height: '2rem',
        minWidth: '9.5rem',
      }}
      disabled={disable}
    >
      Show All
    </Button>
  );
};

export default ResetButton;
