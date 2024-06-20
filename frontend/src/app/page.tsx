import {
  Box,
  Typography,
  Stack,
  Button,
  Container,
  Theme,
  Paper,
} from '@mui/material';
import ButtonsHomePage from '@/components/home/buttons';
import Image from 'next/image';

export default function Home() {
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
          bgcolor: '#141D4F',
          width: {
            sm: '100%',
            lg: '50%',
          },
          padding: '0 6.5rem',
        }}
      >
        <Stack
          sx={{
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
              gap: '4rem',
              minWidth: '300px',
              maxWidth: '680px',
            }}
          >
            <Container
              sx={{
                width: 'auto',
                margin: '0 auto',
              }}
            >
              <Image
                src='/cornestone-connect-logo-blue-wide.png'
                width={305.6}
                height={80}
                alt='logo'
                priority
              />
            </Container>

            <Typography sx={{ textAlign: 'justify' }}>
              Discover the best events in Vancouver with Cornerstone Connect,
              your all-access pass to life on and off campus. Stay engaged, make
              new friends, and find exciting things to do in your free time.
              <br />
              <br />
              With a simple sign-up process, centralized event listings, and
              exclusive access for our students, you’ll have everything you need
              to make the most of your time here. Join us and enrich your
              college experience!
              <br />
              <br />
              Use your <strong>Class365 email</strong> to create your account
              and take advantage of these amazing events!
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
          backgroundImage: 'url("/landingImage.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      ></Box>

      {/* <Stack>
        <Container
          sx={{
            width: 'auto',
            margin: 'auto',
            padding: '0rem 2rem 2rem',
          }}
        >
          <Image
            src='/cornestone-connect-logo-blue-wide.png'
            width={305.6}
            height={80}
            alt='logo'
            priority
          />
        </Container>
        <Typography sx={{ width: '50%' }}>
          Discover the best events in Vancouver with Cornerstone Connect, your
          all-access pass to life on and off campus. Stay engaged, make new
          friends, and find exciting things to do in your free time. With a
          simple sign-up process, centralized event listings, and exclusive
          access for our students, you’ll have everything you need to make the
          most of your time here. Join us and enrich your college experience!
        </Typography>
        <Box>
          <Button>Login</Button>
          <Button>Events</Button>
        </Box>
      </Stack>
      <Box
        width='50%'
        height='100vh'
        position='absolute'
        sx={{
          inset: '0 auto auto 0',
          backgroundImage: 'url("/landingImage.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      ></Box> */}
    </Box>
  );
}
