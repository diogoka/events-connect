import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { EventModalType } from '@/types/components.types';
import { api } from '@/services/api';
import { useSnack } from '@/context/snackContext';

type Props = {
  isOpen: EventModalType;
  user: { id: string | undefined; role: string | undefined };
  closeModal: (id: number) => void;
  handleDeleteAttendees?: () => void;
  isMobile: boolean;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  height: 210,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const iconContainer = {
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  marginTop: '1rem',
};

const buttonStyle = {
  width: '140px',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#3E4977',
  },
};

const deleteButtonStyle = {
  bgcolor: '#FFDAD6',
  color: '#410002',
  width: '140px',
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: '#FFC7C0',
  },
};

const NewEventModal = ({
  isOpen,
  user,
  closeModal,
  handleDeleteAttendees,
  isMobile,
}: Props) => {
  const [open, setOpen] = useState<boolean>(isOpen.isOpen);
  const { openSnackbar } = useSnack();

  const deleteAttendee = async () => {
    try {
      if (handleDeleteAttendees) {
        handleDeleteAttendees();
      } else {
        await api.delete('api/events/attendee', {
          data: {
            eventId: isOpen.eventId,
            userId: user.id,
          },
        });
      }
      openSnackbar(
        'Participation canceled. We are sorry to see you go!',
        'warning'
      );
      closeModal(isOpen.eventId);
    } catch (error) {}
  };

  useEffect(() => {
    setOpen(isOpen.isOpen);
  }, [isOpen]);

  return (
    <Modal
      open={open}
      onClose={() => closeModal(isOpen.eventId)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={{ ...style, width: isMobile ? 400 : 450 }}>
        <Typography
          id='modal-modal-title'
          variant='h6'
          component='h2'
          sx={{ textAlign: 'center', marginBottom: '18px' }}
        >
          Are you sure you want to cancel your participation?
        </Typography>
        <Box sx={iconContainer}>
          <Button
            sx={buttonStyle}
            variant='contained'
            onClick={() => closeModal(isOpen.eventId)}
          >
            No
          </Button>
          <Button
            sx={deleteButtonStyle}
            variant='contained'
            onClick={deleteAttendee}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default NewEventModal;
