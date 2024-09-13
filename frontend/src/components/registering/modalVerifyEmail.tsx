import { Box, Modal, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import ThreeDots from '../animation/theeDots';

type Props = {
  isOpen: boolean;
  handleConfirm: () => void;
};

const ModalVerifyEmail = ({ isOpen, handleConfirm }: Props) => {
  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalContentStyle = {
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px',
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
  };

  const headerModalStyle = {
    position: 'relative',
    display: 'flex',
  };

  const titleStyle = {
    fontWeight: '700',
  };

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const onConfirm = () => {
    setButtonDisabled(true);
    handleConfirm();
  };

  return (
    <>
      <Modal open={isOpen} style={modalStyle}>
        <Box sx={modalContentStyle}>
          <Box sx={headerModalStyle}>
            <Typography sx={titleStyle}>
              Your account was created successfully.
            </Typography>
          </Box>

          <Typography sx={{ marginBottom: '10px' }}>
            Please verify your email before login.
          </Typography>

          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant='contained'
              color='primary'
              disabled={buttonDisabled}
              sx={{
                width: '150px',
                '&:disabled': {
                  cursor: 'not-allowed',
                  pointerEvents: 'auto',
                },
              }}
              onClick={onConfirm}
            >
              {buttonDisabled ? (
                <Typography sx={{ display: 'flex' }}>
                  Redirecting <ThreeDots color='white' />
                </Typography>
              ) : (
                'Confirm'
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalVerifyEmail;
