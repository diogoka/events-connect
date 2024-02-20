import React from 'react';
import { Button, Modal, Box, Typography, AlertColor } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Attendee } from '@/types/types';
import { useRouter } from 'next/navigation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  laptopQuery: boolean;
  setApplied: (value: boolean) => void;
  setAttendees: (value: any) => void;
  id_event: number;
  id_user: string | undefined;
  organizerEvent: boolean;
  handleAlertFn: (
    isOpen: boolean,
    title: string,
    message: string,
    severity: AlertColor
  ) => void;
};

function ModalCancelParticipation({
  isOpen,
  onClose,
  laptopQuery,
  setApplied,
  setAttendees,
  id_event,
  id_user,
  organizerEvent,
  handleAlertFn,
}: Props) {
  const [open, setOpen] = useState(isOpen);

  const router = useRouter();

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
    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/attendee`, {
        data: {
          id_event: id_event,
          id_user: id_user,
        },
      })
      .then((res: any) => {
        handleAlertFn(
          true,
          //eslint-disable-next-line
          "We're sorry to see you go!",
          'You have successfully cancelled your participation.',
          'warning'
        );
        setTimeout(() => {
          handleAlertFn(false, '', '', 'success');
        }, 3500);
        setApplied(false);
        setOpen(false);
        setAttendees((prevData: Array<Attendee> | undefined) => {
          return prevData!.filter((val: any) => val.id !== id_user);
        });
      });

    closingModal();
  };

  const deleteEvent = (id: number) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${id}`, {
        data: {
          id,
        },
      })
      .then((res: any) => {
        closingModal();
        handleAlertFn(
          true,
          'Event deleted!',
          'You will be redirected to the events page',
          'success'
        );
        setTimeout(() => {
          handleAlertFn(false, '', '', 'success');
          router.push('/events');
        }, 3500);
      })
      .catch((err: any) => {
        handleAlertFn(
          true,
          'Error',
          'Something went wrong. Please try again.',
          'error'
        );
      });
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
            {organizerEvent
              ? 'Are you sure you want to delete this event?'
              : 'Are you sure you want to cancel your participation?'}
          </Typography>
          <Box sx={iconContainer}>
            <Button
              sx={buttonStyle}
              variant='contained'
              onClick={(event) => handleCancel(event)}
            >
              {organizerEvent ? 'Cancel' : 'No'}
            </Button>
            <Button
              sx={deleteButtonStyle}
              value='delete'
              variant='contained'
              onClick={
                organizerEvent
                  ? (event) => deleteEvent(id_event)
                  : (event) => handleDelete(event)
              }
            >
              {organizerEvent ? 'Delete' : 'Yes'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalCancelParticipation;
