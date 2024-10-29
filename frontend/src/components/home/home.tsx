'use client';
import {
  Box,
  Typography,
  Stack,
  Container,
  Paper,
  useMediaQuery,
  Skeleton,
  Fade,
} from '@mui/material';
import ButtonsHomePage from '@/components/home/buttons';
import Image from 'next/image';
import { useState } from 'react';

function HomePage() {
  const laptopQuery = useMediaQuery('(min-width:1200px)');
  const [imageLoaded, setImageLoaded] = useState(false);

  const randomBackground = (): number => {
    return Math.floor(Math.random() * 10) + 1;
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        bgcolor: '#4F5B92',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: {
            sm: '100%',
            lg: '50%',
          },
          backgroundImage: {
            sm: `url("/homeBackground${randomBackground()}.jpg")`,
            lg: 'none',
          },
          backgroundSize: {
            sm: 'cover',
          },
          backgroundPosition: {
            sm: 'center',
          },
          padding: '0 6.5rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack
          sx={{
            width: '79%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '4rem 3rem',
              borderRadius: '15px',
              gap: '3rem',
              minWidth: '450px',
              maxWidth: '680px',
            }}
          >
            <Container
              sx={{
                width: 'auto',
                margin: '0 auto',
                display: 'flex',
              }}
            >
              <Image
                src='/cornestone-connect-logo-blue-wide.png'
                width={744}
                height={153}
                alt='logo'
                priority
                style={{ width: '80%', height: 'auto', margin: 'auto' }}
              />
            </Container>

            <Typography sx={{ textAlign: 'justify' }}>
              Discover the best events in Vancouver with Cornerstone Connect,
              your all-access pass to life on and off campus, exclusive for our
              students. Stay engaged, make new friends, and find exciting things
              to do in your free time.
              <br />
              <br />
              Use the <strong>same email registered on Classe365</strong> to
              create your account and take advantage of these amazing events!
            </Typography>
            <ButtonsHomePage />
          </Paper>
        </Stack>
      </Box>

      {laptopQuery && (
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {!imageLoaded && (
            <Skeleton
              variant='rectangular'
              width='100%'
              height='100%'
              sx={{ position: 'absolute' }}
              animation='wave'
            />
          )}
          <Fade in={imageLoaded} timeout={1500}>
            <Box component='span'>
              <Image
                src={`/homeBackground${randomBackground()}.jpg`}
                alt='image'
                layout='responsive'
                width={900}
                height={600}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                onLoadingComplete={() => setImageLoaded(true)}
              />
            </Box>
          </Fade>
        </Box>
      )}
    </Box>
  );
}

export default HomePage;
