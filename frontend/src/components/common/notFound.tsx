import Link from 'next/link';
import { Stack, Typography, Button } from '@mui/material';
import Image from 'next/image';

export default function NotFound() {
  return (
    <Stack alignItems='center' rowGap='2rem' paddingTop='5rem'>
      <Typography
        component='h1'
        lineHeight='4rem'
        marginBlock={0}
        fontSize={80}
        fontFamily='outfit'
      >
        404
      </Typography>
      <Typography>
        Sorry, the page you are looking for can&apos;t be found
      </Typography>
      <Link href='/'>
        <Button
          variant='contained'
          sx={{
            paddingInline: '1.5rem',
          }}
        >
          Go Back to Home
        </Button>
      </Link>
      <Image src='/404.png' width={300} height={300} alt='It is 404 image' />
    </Stack>
  );
}
