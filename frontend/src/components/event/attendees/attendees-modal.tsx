import React from 'react';
import {
  Avatar,
  Button,
  Divider,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { Attendee } from '@/types/types';
import { Box } from '@mui/system';

import closeIconSvg from '../../../../public/icons/closeIconSvg.svg';
import Image from 'next/image';

type Props = {
  attendees: Attendee[];
  open: boolean;
  handleClose: () => void;
};

export default function AttendeesModal({
  attendees,
  open,
  handleClose,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
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
          boxShadow: 24,
          borderRadius: '8px',
          padding: '24px',
          backgroundColor: '#FBF8FF',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '24px', fontWeight: 700 }}>
            Attendees
          </Typography>

          <Button
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
            onClick={() => handleClose()}
          >
            {/* <GoogleIcon
              name='close'
              outlined
              size={24}
              weight={400}
              color='#1B1B21'
            /> */}
            <Image src={closeIconSvg} alt='close icon' width={24} height={24} />
          </Button>
        </Box>
        <Divider sx={{ opacity: 0.3, borderBottomWidth: '3px' }} />
        <Stack
          sx={{
            overflowY: 'auto',
          }}
          divider={<Divider sx={{ opacity: 0.3, borderBottomWidth: '3px' }} />}
          gap={'10px'}
        >
          {attendees.map((attendee, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <Avatar src={attendee.users.avatarURL} alt='avatar' />
              <Typography>{attendee.users.first_name_user}</Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Modal>
  );
}
