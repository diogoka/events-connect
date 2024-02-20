import React, { useState } from 'react';
import ReviewItem from './reviewItem';
import { Review } from './review';
import { Box, Button, Stack } from '@mui/material';
import ReviewsSummary from './reviewsSummary';

type Props = {
  reviews: Review[];
  laptopQuery: boolean;
};

function ReviewsList({ reviews, laptopQuery }: Props) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const totalReviews = reviews.length;
  const displayedReviews = showAllReviews
    ? reviews
    : reviews.slice(0, laptopQuery ? 5 : 3);

  const boxReviewStyle = {
    backgroundColor: '#3333330D',
    width: laptopQuery ? '23.75rem' : '18.4375rem',
    height: '7.625rem',
    borderRadius: '0.9375rem',
    marginBottom: '0.5rem',
    display: 'flex',
    flexDirection: laptopQuery ? 'row' : 'column',
    justifyContent: 'center',
  };

  return (
    <Stack>
      <Stack
        spacing={1}
        useFlexGap
        flexWrap={'wrap'}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <Box sx={boxReviewStyle}>
          <ReviewsSummary reviews={reviews} />
        </Box>
        {displayedReviews.map((review) => (
          <ReviewItem
            review={review}
            key={review.id_review}
            laptopQuery={laptopQuery}
          />
        ))}
      </Stack>
      {(totalReviews > 6 && laptopQuery) ||
        (totalReviews > 3 && !laptopQuery && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='outlined'
              color='primary'
              sx={{
                marginTop: '1rem',
                width: laptopQuery ? '18.4375rem' : '100%',
              }}
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? 'Show less reviews' : 'See all reviews'}
            </Button>
          </Box>
        ))}
    </Stack>
  );
}

export default ReviewsList;
