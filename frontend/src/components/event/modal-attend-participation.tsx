import React from 'react';
import { Button, Modal, Box, Typography, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';
import { width } from '@mui/system';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  addAttendee: () => void;
};

function ModalAttendParticipation({
  isOpen,
  onClose,
  isMobile,
  addAttendee,
}: Props) {
  const [open, setOpen] = useState(isOpen);
  const iconContainer = {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: '1rem',
  };

  const buttonStyle = {
    width: '140px',
    padding: '8px 16px',
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? 400 : 450,
    bgcolor: 'white',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px',
    height: 210,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

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
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='center'
            columnGap='.125rem'
            marginBottom='12px'
          >
            <RiErrorWarningFill
              style={{
                fontSize: '1.5rem',
                color: '#D22B2B',
                marginBottom: '2px',
              }}
            />
            <Typography
              variant='h2'
              fontWeight='bold'
              sx={{ textAlign: 'center' }}
            >
              Payment Required!
            </Typography>
          </Stack>
          <Typography sx={{ textAlign: 'center', marginBottom: '12px' }}>
            Please follow the instruction for payment.
          </Typography>
          <Box sx={iconContainer}>
            <Button
              sx={deleteButtonStyle}
              variant='contained'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              sx={buttonStyle}
              variant='contained'
              color='primary'
              onClick={() => {
                onClose();
                addAttendee();
              }}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ModalAttendParticipation;
