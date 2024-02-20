import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  TextField,
} from '@mui/material';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import { IoMdClose } from 'react-icons/io';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Review } from './review';
import { StarRounded } from '@mui/icons-material';

type Props = {
  user_id: string;
  user_name: string;
  event_id: number;
  openModal: boolean;
  handleClose: () => void;
  updateReviews: (review: Review) => void;
  laptopQuery: boolean;
};

export default function ModalRating({
  user_id,
  event_id,
  openModal,
  handleClose,
  updateReviews,
  user_name,
  laptopQuery,
}: Props) {
  const [review, setReview] = useState({
    id_user: user_id,
    description: '',
    rating: 2.5,
    date_review: new Date(),
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertProps['severity']>('success');

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const snackBarStyle = {
    width: laptopQuery ? '23%' : '90%',
  };

  const muiAlertStyle = {
    '& .MuiAlert-icon': {
      fontSize: '1.5rem',
      marginRight: '0.5rem',
    },
    position: 'fixed' as 'fixed',
    top: '0',
    right: '0',
    margin: '1rem',

    width: laptopQuery ? '22%' : '90%',
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleNewReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { event_id, user_id, review };

    if (review.rating < 1) {
      setSnackbarSeverity('error');
      setSnackbarMessage('The minimum rating is 1 star');
      setSnackbarOpen(true);
      return;
    } else if (review.description === '') {
      setSnackbarSeverity('error');
      setSnackbarMessage('Please write a comment');
      setSnackbarOpen(true);
      return;
    }

    const postReview = await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/review/new`, {
        id_user: user_id,
        id_event: event_id,
        review: {
          id_user: user_id,
          description: review.description,
          rating: review.rating,
          date_review: review.date_review,
        },
      })
      .then((res) => {
        res.data.first_name_user = user_name;
        updateReviews(res.data);
        setSnackbarSeverity('success');
        setSnackbarMessage('Review posted successfully!');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  const setRating = (inputRating: number) => {
    setReview({ ...review, rating: inputRating });
  };

  const setDescription = (inputDescription: string) => {
    setReview({ ...review, description: inputDescription });
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        {...{ user_id, event_id }}
      >
        <Box sx={style}>
          <Stack
            rowGap='1rem'
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: laptopQuery ? '37.5rem' : '18.75rem',
              bgcolor: 'white',
              boxShadow: 24,
              paddingInline: laptopQuery ? '3.5rem' : '1rem',
              paddingBlock: '2rem',
              borderRadius: '1rem',
            }}
          >
            <IoMdClose
              onClick={handleClose}
              style={{
                fontSize: '2rem',
                position: 'absolute',
                inset: '0 0 auto auto',
                transform: 'translate(-50%, 50%)',
              }}
            />
            <Typography variant='h2' fontWeight='bold'>
              Review
            </Typography>
            <form
              onSubmit={handleNewReview}
              style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: '1rem',
              }}
            >
              <Rating
                name='half-rating'
                defaultValue={2}
                precision={1}
                onChange={(event, newValue) => setRating(Number(newValue))}
                emptyIcon={<StarRounded />}
                icon={<StarRounded />}
              />

              <TextField
                id='outlined-multiline-static'
                label='Comments '
                multiline
                rows={9}
                placeholder='Tell us about your experience!'
                variant='outlined'
                onChange={(event) => setDescription(event.target.value)}
              />
              <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant='contained'
                  color='primary'
                  sx={{
                    marginTop: '1rem',
                    width: laptopQuery ? '18.4375rem' : '8.516875rem',
                  }}
                  type='submit'
                  value='New Review'
                >
                  Submit
                </Button>
              </Box>
            </form>
          </Stack>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        sx={snackBarStyle}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={handleSnackbarClose}
          severity={snackbarSeverity as AlertProps['severity']}
          sx={muiAlertStyle}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
