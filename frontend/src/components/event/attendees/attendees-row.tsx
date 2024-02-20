'use client';
import React from 'react';
import { Attendee } from '@/types/types';
import {
  useTheme,
  useMediaQuery,
  Avatar,
  AvatarGroup,
  Box,
  Link,
  Typography,
  Modal,
} from '@mui/material';
import AttendeesModal from './attendees-modal';

const MAX_DISPLAY_AVATARS = 6;

type Props = {
  attendees: Attendee[];
};

export default function AttendeesRow({ attendees }: Props) {
  const theme = useTheme();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const number_attendees =
    attendees.length == 0
      ? 'No attendee'
      : attendees.length == 1
      ? '1 person'
      : `${attendees.length} people`;

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box>{number_attendees}</Box>
        <Link
          display={attendees.length == 0 ? 'none' : 'block'}
          color={theme.palette.info.main}
          component='button'
          sx={{
            fontSize: '1rem',
          }}
          onClick={handleOpen}
        >
          See All
        </Link>
        <AttendeesModal
          attendees={attendees}
          open={open}
          handleClose={handleClose}
        />
      </Box>
      <AvatarGroup
        total={attendees.length}
        max={isMobile ? 4 : 7} // Setting more than 7 doesn't make change
        sx={{
          '.MuiAvatarGroup-avatar': {
            width: '2rem',
            height: '2rem',
            fontSize: '1rem',
          },
        }}
      >
        {attendees.map((attendee: Attendee, index: number) => {
          if (index < MAX_DISPLAY_AVATARS) {
            return (
              <Avatar
                key={index}
                alt={attendee.firstName}
                src={attendee.avatarURL}
              />
            );
          }
        })}
      </AvatarGroup>
    </>
  );
}
