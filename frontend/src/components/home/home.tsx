'use client';
import {
  Box,
  Typography,
  Stack,
  Container,
  Paper,
  Skeleton,
} from '@mui/material';
import ButtonsHomePage from '@/components/home/buttons';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 7200,
  };
}

function HomePage() {
  const [bgLoading, setBgLoading] = useState(true);
  const randomBackground = (): number => Math.floor(Math.random() * 10) + 1;
  const bgImageUrl = `/homeBackground${randomBackground()}.jpg`;

  useEffect(() => {
    const img = new window.Image() as HTMLImageElement;
    img.src = bgImageUrl;
    img.onload = () => setBgLoading(false);
  }, [bgImageUrl]);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
      }}
    >
      <Box
        sx={{
          bgcolor: '#4F5B92',
          width: {
            sm: '100%',
            lg: '50%',
          },
          backgroundImage: {
            sm: !bgLoading ? `url("${bgImageUrl}")` : 'none',
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
          position: 'relative',
        }}
      >
        {bgLoading && (
          <Skeleton
            variant='rectangular'
            animation='wave'
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        )}

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
                width={744} //4.86
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

      <Box
        sx={{
          width: {
            sm: '0',
            lg: '50%',
          },
          backgroundImage: !bgLoading ? `url("${bgImageUrl}")` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {bgLoading && (
          <Skeleton
            variant='rectangular'
            animation='wave'
            sx={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default HomePage;
