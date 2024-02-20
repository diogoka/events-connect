'use client';
import { Button, Modal, Box, Typography, AlertColor } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const iconContainer = {
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  marginTop: '1rem',
};

const buttonStyle = {
  width: '40%',
  height: '2rem',
  bgcolor: 'grey',
  '&:hover': {
    bgcolor: 'lightgrey',
  },
};

const deleteButtonStyle = {
  width: '40%',
  height: '2rem',
  bgcolor: '#D22B2B',
  '&:hover': {
    bgcolor: 'darkred',
  },
};

type Props = {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
  deleteEvent: (id: number) => void;
  eventName?: string;
  laptopQuery: boolean;
  handleAlertFn: (
    isOpen: boolean,
    title: string,
    message: string,
    severity: AlertColor
  ) => void;
};

export default function ModalDelete({
  eventId,
  isOpen,
  onClose,
  deleteEvent,
  eventName,
  laptopQuery,
  handleAlertFn,
}: Props) {
  const [open, setOpen] = useState(isOpen);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: laptopQuery ? '30%' : '90%',
    bgcolor: 'white',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px',
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const response = await axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${eventId}`)
      .then((res) => {
        handleAlertFn(
          true,
          'Event Deleted',
          'The event was successfully deleted',
          'success'
        );
        setTimeout(() => {
          handleAlertFn(false, '', '', 'success');
        }, 2000);
        setOpen(false);
        setTimeout(() => {
          deleteEvent(eventId);
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
      });
    await closingModal();
  };

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closingModal();
  };

  const closingModal = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Box sx={{ flexGrow: 1, position: 'absolute' }}>
      <Modal
        open={open}
        onClose={closingModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography variant='h2' sx={{ textAlign: 'center' }}>
            Are you sure you want to delete the event <br></br>
            <strong>{eventName}</strong> ?
          </Typography>
          <Box sx={iconContainer}>
            <Button
              sx={buttonStyle}
              variant='contained'
              onClick={(event) => handleCancel(event)}
            >
              Cancel
            </Button>
            <Button
              sx={deleteButtonStyle}
              value='delete'
              variant='contained'
              onClick={(event) => handleDelete(event)}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
