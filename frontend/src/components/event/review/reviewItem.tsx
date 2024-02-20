import React from 'react';
import { Review } from './review';
import Box from '@mui/material/Box';
import { Avatar, Rating, Typography } from '@mui/material';
import { StarRounded } from '@mui/icons-material';

type Props = {
  review: Review;
  laptopQuery: boolean;
};

function ReviewItem({ review, laptopQuery }: Props) {
  const today = new Date(review.date_review);
  const daysAgo = Math.floor(
    (new Date().setHours(0, 0, 0, 0) -
      new Date(review.date_review).setHours(0, 0, 0, 0)) /
      (1000 * 3600 * 24)
  );

  const boxReviewStyle = {
    backgroundColor: '#3333330D',
    width: laptopQuery ? '23.75rem' : '18.4375rem',
    height: '7.625rem',
    borderRadius: '0.9375rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '1rem',
    rowGap: '0.5rem',
  };

  const boxReviewLaptopStyle = {
    display: 'flex',
    alignItems: laptopQuery ? 'center' : 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: laptopQuery ? 'row' : 'column',
    columnGap: '0.5rem',
    rowGap: '0.5rem',
  };

  const daysAgoString = (days: number) => {
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days > 7) {
      return (days / 7).toFixed(0) + ' weeks ago';
    } else {
      return days + ' days ago';
    }
  };

  return (
    <Box sx={boxReviewStyle}>
      <Box sx={boxReviewLaptopStyle}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            columnGap: '0.8rem',
          }}
        >
          <Avatar
            src={review.avatar_url}
            alt={review.first_name_user}
            sx={{
              width: '2.1875rem',
              height: '2.1875rem',
            }}
          />
          <Typography
            sx={{ fontSize: '1rem', display: 'flex', justifyContent: 'center' }}
          >
            {review.first_name_user}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', columnGap: '0.8rem' }}>
          <Rating
            name='read-only'
            value={Number(review.rating)}
            readOnly
            size='small'
            precision={0.5}
            emptyIcon={<StarRounded sx={{ fontSize: '1.125rem' }} />}
            icon={<StarRounded sx={{ fontSize: '1.125rem' }} />}
          />
          <Typography
            sx={{ fontSize: '0.75rem', color: 'rgba(51, 51, 51, 0.75)' }}
          >
            {daysAgoString(daysAgo)}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant='body2'>{review.description_review}</Typography>
      </Box>
    </Box>
  );
}

export default ReviewItem;
