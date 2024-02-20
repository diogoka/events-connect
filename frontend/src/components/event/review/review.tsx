import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, useMediaQuery, Stack } from '@mui/material';
import axios from 'axios';
import ReviewsList from './reviewsList';
import ModalRating from './modal-review';
import { UserContext } from '@/context/userContext';

const boxNoReviewStyle = {
  backgroundColor: '#3333330D',
  height: '7.625rem',
  borderRadius: '0.9375rem',
  marginTop: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

type Props = {
  id_event: number;
  applied: boolean;
};

export interface Review {
  id_review: number;
  date_review: string;
  description_review: string;
  first_name_user: string;
  avatar_url: string;
  rating: number;
  id_user: string;
}

function Review({ id_event, applied }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReview, setHasReview] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { user } = useContext(UserContext);
  const laptopQuery = useMediaQuery('(min-width:769px)');
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const [userHasReviewed, setUserHasReviewed] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/reviews/${id_event}`
      )
      .then((res) => {
        res.data.reviews = orderReviews(res.data.reviews);
        setReviews(res.data.reviews);
        if (res.data.reviews.length > 0) {
          setHasReview(true);
        }
        userHasReviewedEvent(res.data.reviews);
      });
  }, []);

  const updateReviews = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
    setHasReview(true);
    setUserHasReviewed(true);
    handleClose();
  };

  const orderReviews = (reviews: Review[]) => {
    return reviews.sort((a, b) => {
      return (
        new Date(b.date_review).getTime() - new Date(a.date_review).getTime()
      );
    });
  };

  const userHasReviewedEvent = (reviews: Review[]) => {
    if (user) {
      reviews.forEach((review) => {
        if (review.id_user === user.id) {
          setUserHasReviewed(true);
        }
      });
    }
  };

  return (
    <>
      <Box sx={{ marginTop: '1rem' }}>
        <Typography variant='h2' fontWeight='bold'>
          Reviews
        </Typography>
        {applied && !userHasReviewed && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='contained'
              color='primary'
              sx={{ marginTop: '1rem', width: '18.4375rem' }}
              onClick={handleOpen}
            >
              Add Review
            </Button>
          </Box>
        )}

        {hasReview ? (
          <Stack
            direction={laptopQuery ? 'row' : 'column'}
            spacing={laptopQuery ? 2 : 0}
            sx={{ marginTop: '1rem' }}
          >
            <ReviewsList reviews={reviews} laptopQuery={laptopQuery} />
          </Stack>
        ) : (
          <Box sx={boxNoReviewStyle}>
            <Typography variant='h2'>No Reviews</Typography>
          </Box>
        )}
      </Box>
      {user && (
        <ModalRating
          user_id={user!.id}
          event_id={id_event}
          user_name={user!.firstName}
          openModal={openModal}
          handleClose={handleClose}
          updateReviews={updateReviews}
          laptopQuery={laptopQuery}
        />
      )}
    </>
  );
}

export default Review;
