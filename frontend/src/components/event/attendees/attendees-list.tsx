import React from 'react';
import AttendeesItem from './attendees-item';
import { Box } from '@mui/material';
import { Attendee } from '@/types/types';

type Props = {
  attendees: Attendee[];
};

export default function AttendeesList({ attendees }: Props) {
  return (
    <Box
      display='flex'
      rowGap='1rem'
      overflow='scroll'
      flexWrap='wrap'
      justifyContent='space-between'
    >
      {attendees.map((attendee: Attendee, index: number) => {
        return <AttendeesItem key={index} attendee={attendee} />;
      })}
    </Box>
  );
}
