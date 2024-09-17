import { Box, CardMedia, Fade, Skeleton, Typography } from '@mui/material';
import React from 'react';

type Props = {
  imageLoaded: boolean;
  imageUrl: string;
  monthAndDay: string;
  handleLoadedImage: () => void;
};

const EventImageWithDate = ({
  imageLoaded,
  imageUrl,
  monthAndDay,
  handleLoadedImage,
}: Props) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {!imageLoaded && (
        <Skeleton
          variant='rectangular'
          height='208px'
          sx={{ borderRadius: '4px' }}
          animation='wave'
        />
      )}
      <Fade in={imageLoaded} timeout={1500} easing={'ease-in'}>
        <CardMedia
          component={'img'}
          sx={{
            height: '208px',
            width: '100%',
            borderRadius: '4px',
            display: imageLoaded ? 'block' : 'none',
          }}
          image={imageUrl}
          title='event_image'
          onLoad={handleLoadedImage}
        />
      </Fade>
      <Box
        sx={{
          backgroundColor: ' #FBF8FF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          width: '57px',
          height: '58px',
          marginLeft: '8px',
          marginTop: '8px',
          position: 'absolute',
          top: '0',
        }}
      >
        <Typography>{monthAndDay.split(' ')[0]}</Typography>
        <Typography sx={{ fontWeight: '700' }}>
          {monthAndDay.split(' ')[1]}
        </Typography>
      </Box>
    </Box>
  );
};

export default EventImageWithDate;
