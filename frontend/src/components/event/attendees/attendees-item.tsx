import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

import { Attendee } from '@/types/types';

type Props = {
  attendee: Attendee;
};

export default function AttendeesItem({ attendee }: Props) {
  return (
    <Box
      display='flex'
      alignItems='center'
      columnGap='1rem'
      minWidth='240px'
      width='48%'
    >
      <Avatar alt={attendee.firstName} src={attendee.avatarURL} />
      <Typography fontSize='1.125rem'>{attendee.firstName}</Typography>
    </Box>
  );
}
