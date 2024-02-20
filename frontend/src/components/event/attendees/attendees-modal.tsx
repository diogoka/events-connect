import React from 'react';
import { Modal, Stack, Typography } from '@mui/material';
import { Attendee } from '@/types/types';
import { Box } from '@mui/system';
import { IoMdClose } from 'react-icons/io';
import AttendeesList from './attendees-list';

type Props = {
  attendees: Attendee[];
  open: boolean;
  handleClose: () => void;
};

export default function AttendeesModal(props: Props) {
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Stack
        rowGap='1rem'
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 500,
          width: '90%',
          maxWidth: '680px',
          bgcolor: 'white',
          boxShadow: 24,
          paddingInline: '1rem',
          paddingBlock: '2rem',
          borderRadius: '1rem',
        }}
      >
        <IoMdClose
          onClick={props.handleClose}
          style={{
            fontSize: '2rem',
            position: 'absolute',
            inset: '0 0 auto auto',
            transform: 'translate(-50%, 50%)',
          }}
        />
        <Box display='flex' alignItems='center' columnGap='1rem'>
          <Typography variant='h2' fontWeight='bold'>
            Attendees
          </Typography>
          <Typography>{props.attendees.length}</Typography>
        </Box>
        <AttendeesList attendees={props.attendees} />
      </Stack>
    </Modal>
  );
}
