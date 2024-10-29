import React, { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ThreeDots from '../animation/theeDots';

type Props = {
  isOpen: boolean;
  handleClose: Dispatch<SetStateAction<boolean>>;
};

export const ResendEmailModal = ({ isOpen, handleClose }: Props) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [isEmailSent, setIsSentEmail] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const modalContentStyle = {
    position: 'relative',
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
    minWidth: '350px',
  };

  const headerModalStyle = {
    position: 'relative',
    display: 'flex',
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const closeModal = () => {
    handleClose(false);
  };

  const handleResendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSnackbarMessage(null);
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/resendVerifyEmail`,
        { email }
      );
      setSnackbarMessage('Email verification link sent successfully.');
      setSnackbarOpen(true);
      setSnackbarSeverity('success');
      setIsSentEmail(true);
      setTimeout(() => {
        closeModal();
        setSnackbarOpen(false);
        setIsLoading(false);
        setIsSentEmail(false);
      }, 3000);
    } catch (error: any) {
      setSnackbarMessage(error.response.data.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal open={isOpen} style={modalStyle} onClose={closeModal}>
        <Box sx={modalContentStyle}>
          <IconButton
            onClick={() => handleClose(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={headerModalStyle}>
            <form onSubmit={handleResendEmail} style={{ width: '100%' }}>
              <Stack rowGap='20px'>
                <Typography variant='h6' align='left'>
                  Please enter your email:
                </Typography>

                <TextField
                  type='email'
                  label='Email'
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isLoading || isEmailSent}
                  sx={{
                    width: '100px',
                    marginInline: 'auto',
                  }}
                >
                  {isLoading ? (
                    <ThreeDots color='white' />
                  ) : isEmailSent && snackbarSeverity === 'success' ? (
                    <CheckCircleIcon />
                  ) : (
                    'OK'
                  )}
                </Button>
              </Stack>
            </form>
          </Box>
          <Snackbar
            open={snackbarOpen}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            sx={{ zIndex: 9999 }}
          >
            <SnackbarContent
              message={snackbarMessage}
              sx={{
                backgroundColor: snackbarSeverity === 'error' ? 'red' : 'green',
                color: '#FFFFFF',
                borderRadius: '6px',
                zIndex: 9999,
              }}
              action={
                <Button sx={{ color: '#FFFFFF' }} onClick={handleSnackbarClose}>
                  X
                </Button>
              }
            />
          </Snackbar>
        </Box>
      </Modal>
    </>
  );
};
