import React, { useState, useEffect } from 'react';
import { Review } from './review';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { StarRounded } from '@mui/icons-material';
import { averageRatingFn } from '../../../common/functions';

type Props = {
  reviews: Review[];
};

function ReviewsSummary({ reviews }: Props) {
  const [numReviews, setNumReviews] = useState(0);
  const [numOfRatings, setNumOfRatings] = useState([0, 0, 0, 0, 0]);
  const [avgRating, setAvgRating] = useState(0);

  const total = reviews.length;

  const countingRating = (reviews: Review[]) => {
    const numOfRatings = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      let index = Math.floor(review.rating);
      numOfRatings[index - 1] += 1;
    });
    return numOfRatings;
  };

  const percentage = (num: number) => {
    return (num / total) * 100;
  };

  useEffect(() => {
    setNumReviews(reviews.length);
    setAvgRating(averageRatingFn(reviews));
    setNumOfRatings(countingRating(reviews));
  }, [reviews]);

  const formattedAvgRating = avgRating.toFixed(1);

  const BoxSummaryStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    width: '100%',
    columnGap: '0.8rem',
  };

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === 'light' ? 300 : 300],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#faaf00' : '#308fe8',
    },
  }));

  return (
    <Box style={BoxSummaryStyle}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '4% 95%',
          gridTemplateRows: 'repeat(5, 1.2rem)',
          alignItems: 'center',
          columnGap: '0.5rem',
          flex: '1',
        }}
      >
        {numOfRatings
          .slice()
          .reverse()
          .map((num, index) => (
            <React.Fragment key={index}>
              <Box>
                <Typography sx={{ fontSize: '1rem' }}>{5 - index}</Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <BorderLinearProgress
                  variant='determinate'
                  value={percentage(num)}
                />
              </Box>
            </React.Fragment>
          ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: '0.40rem',
        }}
      >
        <Typography variant='h2'>{formattedAvgRating}</Typography>
        <Rating
          name='read-only'
          value={avgRating}
          readOnly
          size='small'
          emptyIcon={<StarRounded sx={{ fontSize: '1.125rem' }} />}
          icon={<StarRounded sx={{ fontSize: '1.125rem' }} />}
        />
        <Typography sx={{ fontSize: '0.75rem' }}>
          ({numReviews === 1 ? `${numReviews} Review` : `${numReviews} Reviews`}
          )
        </Typography>
      </Box>
    </Box>
  );
}

export default ReviewsSummary;
