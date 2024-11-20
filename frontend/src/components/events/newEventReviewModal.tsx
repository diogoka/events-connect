import React, { useEffect, useState } from 'react';
import { useSnack } from '@/context/snackContext';
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { IoMdClose } from 'react-icons/io';
import { StarRounded } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import { EventModalType } from '@/types/components.types';
import { api } from '@/services/api';
import ThreeDots from '../animation/theeDots';

type Props = {
  isOpen: EventModalType;
  user: { id: string | undefined; role: string | undefined };
  closeModal: () => void;
  isMobile: boolean;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const NewEventReviewModal = ({ isOpen, user, closeModal, isMobile }: Props) => {
  const [open, setOpen] = useState<boolean>(isOpen.isOpen);
  const { openSnackbar } = useSnack();

  const [isLoading, setIsLoading] = useState(false);

  const [review, setReview] = useState({
    id_user: user.id,
    description: '',
    rating: 2.5,
    date_review: new Date(),
  });

  const handleNewReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (review.rating < 1) {
      openSnackbar('The minimum rating is 1 start', 'error');
      return;
    } else if (review.description === '') {
      openSnackbar('Please write a comment', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/api/events/review/new', {
        id_event: isOpen.eventId,
        id_user: review.id_user,
        review: {
          description: review.description,
          rating: review.rating,
          date_review: review.date_review,
        },
      });
      openSnackbar('Review created', 'success');
      closeModal();
    } catch (error: any) {
      openSnackbar(`${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const setRating = (inputRating: number) => {
    setReview({ ...review, rating: inputRating });
  };

  const setDescription = (inputDescription: string) => {
    setReview({ ...review, description: inputDescription });
  };

  useEffect(() => {
    setOpen(isOpen.isOpen);
  }, [isOpen]);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Stack
          rowGap='1rem'
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? 650 : 400,
            bgcolor: 'white',
            boxShadow: 24,
            paddingInline: '3.5rem',
            paddingBlock: '2rem',
            borderRadius: '1rem',
          }}
        >
          <IoMdClose
            onClick={closeModal}
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
                  width: '18.4375rem',
                }}
                type='submit'
                value='New Review'
              >
                {isLoading ? <ThreeDots color='#FFF' /> : 'Submit'}
              </Button>
            </Box>
          </form>
        </Stack>
      </Box>
    </Modal>
  );
};

export default NewEventReviewModal;
